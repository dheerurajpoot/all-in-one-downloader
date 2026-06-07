import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { Innertube } from "youtubei.js";

const execFilePromise = promisify(execFile);

// Helper to extract YouTube Video ID more robustly
function getYouTubeId(url: string) {
	const regex =
		/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
	const match = url.match(regex);
	return match ? match[1] : null;
}

// Helper for YouTube Fallback using a public reliable downloader API (Last Resort)
async function getPublicApiFallback(videoId: string) {
	try {
		console.log(
			`[Downloader] Attempting Public API fallback for: ${videoId}`,
		);
		// Try using a well-known public API (Vevioz/Y2Mate based)
		const res = await fetch(
			`https://api.vevioz.com/api/button/videos/${videoId}`,
			{
				headers: { "User-Agent": "Mozilla/5.0" },
				signal: AbortSignal.timeout(5000),
			},
		);

		if (res.ok) {
			// This usually returns HTML or redirect, if it's a direct API we handle it
			// For now, we use it as a signal that the video is valid and we can try Cobalt again
			return null;
		}
	} catch (e) {
		return null;
	}
	return null;
}

// Helper for YouTube Fallback using youtubei.js
async function getYouTubeInfoFallback(videoId: string) {
	try {
		console.log(
			`[Downloader] Attempting youtubei.js fallback for: ${videoId}`,
		);
		// Force specific client and bypass checks
		const youtube = await Innertube.create({
			generate_session_locally: true,
			retrieve_player: true,
			location: "US", // Sometimes setting a location helps
		});

		const info = await youtube.getInfo(videoId);

		const title = info.basic_info.title || "YouTube Video";
		const thumbnail = info.basic_info.thumbnail?.[0]?.url || "";

		// Try to get streaming data directly if adaptive_formats are empty
		const streamingData = info.streaming_data;
		if (!streamingData) {
			console.log("[Downloader] No streaming data found in youtubei.js");
			return null;
		}

		const formats = streamingData.adaptive_formats || [];
		const combinedFormats = streamingData.formats || [];

		const allFormats = await Promise.all(
			[...combinedFormats, ...formats]
				.filter((f) => f.url || f.signature_cipher || f.cipher)
				.map(async (f) => {
					const url =
						f.url || (await f.decipher(youtube.session.player));
					const isAudio = !f.has_video;
					const isVideo = !f.has_audio;
					let quality = f.quality_label || f.quality;

					if (!quality) {
						if (f.height) quality = `${f.height}p`;
						else if (f.width) quality = `${f.width}p`;
						else quality = isAudio ? "Audio" : "Video";
					}

					return {
						quality:
							quality +
							(isAudio
								? " (Audio only)"
								: isVideo
									? " (Video only)"
									: " (Video + Audio)"),
						url: `/api/proxy?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&platform=youtube`,
						size: f.content_length
							? `${(Number(f.content_length) / 1048576).toFixed(2)} MB`
							: undefined,
					};
				}),
		);

		if (allFormats.length === 0) {
			console.log(
				`[Downloader] youtubei.js returned no formats for ${videoId}`,
			);
			return null;
		}

		// Sort and filter to top 3 meaningful options
		const sorted = allFormats.sort((a: any, b: any) => {
			const aCombined = a.quality.includes("Video + Audio");
			const bCombined = b.quality.includes("Video + Audio");
			if (aCombined && !bCombined) return -1;
			if (!aCombined && bCombined) return 1;
			return 0;
		});

		const top3 = sorted.slice(0, 3);

		return {
			success: true,
			title,
			thumbnail,
			downloadLink: top3[0]?.url || "",
			formats: top3,
		};
	} catch (error) {
		console.error("[Downloader] youtubei.js fallback failed:", error);
		return null;
	}
}

// Helper for YouTube Fallback using Invidious API
async function getInvidiousFallback(videoId: string) {
	const instances = [
		"https://invidious.snopyta.org",
		"https://yewtu.be",
		"https://invidious.kavin.rocks",
		"https://vid.puffyan.us",
		"https://inv.riverside.rocks",
		"https://invidious.namazso.eu",
	];

	for (const instance of instances) {
		try {
			console.log(
				`[Downloader] Attempting Invidious fallback via: ${instance}`,
			);
			const res = await fetch(`${instance}/api/v1/videos/${videoId}`, {
				signal: AbortSignal.timeout(5000),
			});
			if (res.ok) {
				const data = await res.json();
				if (data.formatStreams && data.formatStreams.length > 0) {
					const title = data.title || "YouTube Video";
					const formats = data.formatStreams
						.map((f: any) => ({
							quality: f.qualityLabel || f.quality || "Video",
							url: `/api/proxy?url=${encodeURIComponent(f.url)}&title=${encodeURIComponent(title)}&platform=youtube`,
							size: f.size,
						}))
						.slice(0, 3);

					return {
						success: true,
						title,
						thumbnail: data.videoThumbnails?.[0]?.url || "",
						downloadLink: formats[0].url,
						formats,
					};
				}
			}
		} catch (e) {
			continue;
		}
	}
	return null;
}

// Helper for Universal Fallback using public Cobalt API
async function getCobaltFallback(videoUrl: string) {
	const instances = [
		"https://cobalt.meowing.de/",
		"https://cobalt.qwedl.com/",
		"https://cobalt.draco.sh/",
		"https://cobalt.api.3kh0.net/",
		"https://cobalt-backend.canine.tools/",
		"https://cobalt.v07.me/",
	];

	for (const instance of instances) {
		try {
			console.log(
				`[Downloader] Attempting Cobalt fallback via: ${instance}`,
			);
			const response = await fetch(instance, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					url: videoUrl,
					videoQuality: "720",
				}),
			});

			if (response.ok) {
				const data = await response.json();
				if (data.status !== "error" && data.url) {
					return {
						success: true,
						title: data.text || "Video",
						thumbnail: "",
						downloadLink: `/api/proxy?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.text || "video")}&platform=youtube`,
						formats: [{ quality: "Auto", url: data.url }],
					};
				}
			}
		} catch (e) {
			continue;
		}
	}
	return null;
}

// Helper for YouTube Fallback using RapidAPI (YouTube86)
async function getRapidApiYoutube86Fallback(videoUrl: string) {
	try {
		console.log(
			`[Downloader] Attempting YouTube86 RapidAPI fallback for: ${videoUrl}`,
		);
		const apiKey = "d8045c213amsh143b96bd9642de6p1e99b0jsn87aad002725a";
		const apiHost = "youtube86.p.rapidapi.com";

		// Step 1: Request video information and start download job
		// Most YouTube download APIs on RapidAPI have an endpoint like /v2/fetch or /dl
		// For youtube86, based on common patterns and the status endpoint provided, we'll try to initiate the request.
		const res = await fetch(
			`https://${apiHost}/?url=${encodeURIComponent(videoUrl)}`,
			{
				method: "GET",
				headers: {
					"x-rapidapi-key": apiKey,
					"x-rapidapi-host": apiHost,
				},
			},
		);

		if (!res.ok) {
			console.log(
				`[Downloader] YouTube86 start request failed: ${res.status}`,
			);
			return null;
		}

		let data = await res.json();

		// If the response is a job ID (common in asynchronous APIs), we poll the status endpoint
		if (data.id || data.jobId || data.sid) {
			const jobId = data.id || data.jobId || data.sid;
			console.log(
				`[Downloader] YouTube86 Job ID: ${jobId}, polling status...`,
			);

			// Poll status up to 5 times
			for (let i = 0; i < 5; i++) {
				await new Promise((resolve) => setTimeout(resolve, 2000));
				const statusRes = await fetch(
					`https://${apiHost}/status/${jobId}`,
					{
						method: "GET",
						headers: {
							"x-rapidapi-key": apiKey,
							"x-rapidapi-host": apiHost,
						},
					},
				);

				if (statusRes.ok) {
					const statusData = await statusRes.json();
					if (
						statusData.status === "finished" ||
						statusData.links ||
						statusData.url
					) {
						data = statusData;
						break;
					}
				}
			}
		}

		// Handle the response data
		if (data && (data.links || data.url || data.formats)) {
			const title = data.title || "YouTube Video";
			const thumbnail = data.thumbnail || "";

			// Normalize formats
			const rawFormats = data.links || data.formats || [];
			const formats = Array.isArray(rawFormats)
				? rawFormats.map((f: any) => ({
						quality: f.quality || f.label || "Auto",
						url: `/api/proxy?url=${encodeURIComponent(f.url || f.link)}&title=${encodeURIComponent(title)}&platform=youtube`,
						size: f.size,
					}))
				: [];

			if (formats.length === 0 && data.url) {
				formats.push({
					quality: "Auto",
					url: `/api/proxy?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(title)}&platform=youtube`,
					size: undefined,
				});
			}

			if (formats.length > 0) {
				return {
					success: true,
					title,
					thumbnail,
					downloadLink: formats[0].url,
					formats: formats.slice(0, 3),
				};
			}
		}
	} catch (error) {
		console.error(
			"[Downloader] YouTube86 RapidAPI fallback failed:",
			error,
		);
	}
	return null;
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		let { url: videoUrl } = body;

		if (!videoUrl) {
			return NextResponse.json(
				{ error: "URL is required" },
				{ status: 400 },
			);
		}

		// Extreme Sanitization: remove backticks, quotes, and all whitespace
		videoUrl = videoUrl.replace(/[`"'\s]/g, "").trim();

		// Validate URL format
		const urlPattern = /^https?:\/\//i;
		if (!urlPattern.test(videoUrl)) {
			return NextResponse.json(
				{ error: "Invalid URL format. Please provide a valid link." },
				{ status: 400 },
			);
		}

		const platform = detectPlatform(videoUrl);
		console.log(
			`[Downloader] Detected Platform: ${platform} for URL: ${videoUrl}`,
		);

		try {
			// Determine yt-dlp binary path
			const localBinaryPath = path.join(process.cwd(), "bin", "yt-dlp");
			let binaryToUse = "yt-dlp";

			if (
				process.platform === "linux" &&
				fs.existsSync(localBinaryPath)
			) {
				binaryToUse = localBinaryPath;
			}

			// Handle YouTube Cookies if provided via environment variable
			// This is the most reliable way to bypass "Sign in to confirm you're not a bot"
			let cookiesPath = "";
			if (platform === "youtube" && process.env.YOUTUBE_COOKIES) {
				try {
					cookiesPath = path.join(
						"/tmp",
						`cookies_${Date.now()}.txt`,
					);
					const cookiesContent = process.env.YOUTUBE_COOKIES.replace(
						/\\n/g,
						"\n",
					);
					fs.writeFileSync(cookiesPath, cookiesContent);
					console.log(
						`[Downloader] Using cookies from environment variable`,
					);
				} catch (err) {
					console.error(
						"[Downloader] Failed to write cookies file:",
						err,
					);
				}
			}

			let ytDlpArgs = ["--dump-json", "--no-playlist"];

			// Add specific workarounds based on platform
			if (platform === "youtube") {
				if (cookiesPath) {
					// When cookies are present, the 'tv' client is the absolute best for servers
					// It doesn't require PO Tokens or complex 'n' challenge solving
					ytDlpArgs.push(
						"--extractor-args",
						"youtube:player_client=tv;player_skip=webpage",
						"--user-agent",
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
						"--cookies",
						cookiesPath,
					);
				} else {
					// When no cookies are present, mobile/vr clients are our best bet for bypass
					ytDlpArgs.push(
						"--extractor-args",
						"youtube:player_client=android_vr,ios;player_skip=webpage",
						"--user-agent",
						"com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X; en_US)",
					);
				}

				ytDlpArgs.push(
					"--referer",
					"https://www.youtube.com/",
					"--no-check-certificates",
					"--geo-bypass",
					"--force-ipv4",
					"--no-cache-dir",
				);
			} else {
				// Standard User-Agent for other platforms
				ytDlpArgs.push(
					"--user-agent",
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
				);

				if (platform === "instagram") {
					ytDlpArgs.push(
						"--extractor-args",
						"instagram:client=android",
						"--add-header",
						"Referer:https://www.instagram.com/",
						"--add-header",
						"Origin:https://www.instagram.com",
						"--no-check-certificates",
					);
				}
			}

			// Add the URL as the last argument
			ytDlpArgs.push(videoUrl);

			let stdout = "";
			let stderr = "";

			try {
				const result = await execFilePromise(binaryToUse, ytDlpArgs, {
					timeout: 30000,
					maxBuffer: 10 * 1024 * 1024,
				});
				stdout = result.stdout;
				stderr = result.stderr;
			} catch (ytError: any) {
				console.error(
					"[Downloader] Primary yt-dlp failed:",
					ytError.message,
				);

				// --- YOUTUBE FALLBACK STRATEGY ---
				if (platform === "youtube") {
					const videoId = getYouTubeId(videoUrl);

					if (videoId) {
						// Fallback 0.5: If cookies failed, try one more time with Mobile App Identity (No Cookies)
						if (cookiesPath) {
							try {
								console.log(
									"[Downloader] Cookie attempt failed, trying Mobile App Identity fallback...",
								);
								const noCookieArgs = [
									"--dump-json",
									"--no-playlist",
									"--extractor-args",
									"youtube:player_client=android_vr,ios;player_skip=webpage",
									"--user-agent",
									"com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X; en_US)",
									"--no-check-certificates",
									"--geo-bypass",
									"--force-ipv4",
									videoUrl,
								];
								const result = await execFilePromise(
									binaryToUse,
									noCookieArgs,
									{ timeout: 20000 },
								);
								if (result.stdout) {
									stdout = result.stdout;
									// If this works, we can proceed to the normal JSON parsing below
								} else {
									throw new Error(
										"Mobile fallback returned no data",
									);
								}
							} catch (fallbackErr) {
								console.log(
									"[Downloader] Mobile App fallback also failed.",
								);
								// Fallback 1: youtubei.js (Direct API)
								const fallbackData =
									await getYouTubeInfoFallback(videoId);
								if (fallbackData)
									return NextResponse.json(fallbackData);

								// Fallback 1.5: RapidAPI YouTube86
								const rapidApiData =
									await getRapidApiYoutube86Fallback(
										videoUrl,
									);
								if (rapidApiData)
									return NextResponse.json(rapidApiData);

								// Fallback 2: Invidious API (Distributed Fetch)
								const invidiousData =
									await getInvidiousFallback(videoId);
								if (invidiousData)
									return NextResponse.json(invidiousData);

								// Fallback 3: Public API Signal + Cobalt
								await getPublicApiFallback(videoId);
								const cobaltData =
									await getCobaltFallback(videoUrl);
								if (cobaltData)
									return NextResponse.json(cobaltData);
							}
						} else {
							// Normal fallback chain if no cookies were used in primary
							const fallbackData =
								await getYouTubeInfoFallback(videoId);
							if (fallbackData)
								return NextResponse.json(fallbackData);

							// Fallback 1.5: RapidAPI YouTube86
							const rapidApiData =
								await getRapidApiYoutube86Fallback(videoUrl);
							if (rapidApiData)
								return NextResponse.json(rapidApiData);

							const invidiousData =
								await getInvidiousFallback(videoId);
							if (invidiousData)
								return NextResponse.json(invidiousData);

							await getPublicApiFallback(videoId);
							const cobaltData =
								await getCobaltFallback(videoUrl);
							if (cobaltData)
								return NextResponse.json(cobaltData);
						}
					}
				}

				// If stdout is still empty, it means all fallbacks failed
				if (!stdout) throw ytError;
			}

			// Clean up temporary cookies file
			if (cookiesPath && fs.existsSync(cookiesPath)) {
				try {
					fs.unlinkSync(cookiesPath);
				} catch (err) {
					/* ignore */
				}
			}

			if (stderr && !stdout) {
				console.error("[Downloader] yt-dlp error:", stderr);
				throw new Error(stderr);
			}

			const info = JSON.parse(stdout);
			const title = info.title || "Video";
			let thumbnail = info.thumbnail || info.thumbnails?.[0]?.url || "";

			// Proxy thumbnails for platforms that block hotlinking (Instagram, Facebook)
			if (platform === "instagram" || platform === "facebook") {
				thumbnail = `/api/proxy?url=${encodeURIComponent(thumbnail)}&platform=${platform}&type=thumbnail`;
			}

			// Filter formats to get useful ones
			// We prioritize formats that have both video and audio (combined)
			const allFormats = info.formats
				.filter((f: any) => f.url)
				.map((f: any) => {
					const hasVideo = f.vcodec !== "none";
					const hasAudio = f.acodec !== "none";

					let quality =
						f.quality_label || f.format_note || f.resolution;

					if (!quality) {
						if (f.height) quality = `${f.height}p`;
						else if (f.width) quality = `${f.width}p`;
						else quality = f.format_id || "Unknown Quality";
					}

					// Make labels more user-friendly
					if (hasVideo && hasAudio) {
						quality += " (HD Video)";
					} else if (hasVideo) {
						quality += " (Video only)";
					} else if (hasAudio) {
						quality += " (Audio only)";
					}

					return {
						quality: quality,
						url: `/api/proxy?url=${encodeURIComponent(f.url)}&title=${encodeURIComponent(title)}&platform=${platform}`,
						size: f.filesize
							? `${(f.filesize / 1048576).toFixed(2)} MB`
							: f.filesize_approx
								? `~${(f.filesize_approx / 1048576).toFixed(2)} MB`
								: undefined,
						hasVideo,
						hasAudio,
						height: f.height || 0,
					};
				});

			// Sort formats: Combined (Video+Audio) first, then by resolution (height)
			const sortedFormats = allFormats.sort((a: any, b: any) => {
				// Combined formats first
				if (a.hasVideo && a.hasAudio && !(b.hasVideo && b.hasAudio))
					return -1;
				if (!(a.hasVideo && a.hasAudio) && b.hasVideo && b.hasAudio)
					return 1;
				// Then by height
				return b.height - a.height;
			});

			// Filter to top 3 meaningful options (e.g., Best Combined, Second Best Combined, Best Audio)
			const topFormats: any[] = [];
			const combined = sortedFormats.filter(
				(f: any) => f.hasVideo && f.hasAudio,
			);
			const videoOnly = sortedFormats.filter(
				(f: any) => f.hasVideo && !f.hasAudio,
			);
			const audioOnly = sortedFormats.filter(
				(f: any) => f.hasAudio && !f.hasVideo,
			);

			// Add up to 2 best combined formats
			if (combined.length > 0) topFormats.push(combined[0]);
			if (combined.length > 1) topFormats.push(combined[1]);

			// Add best audio only if we have space
			if (topFormats.length < 3 && audioOnly.length > 0)
				topFormats.push(audioOnly[0]);

			// Fill remaining slots with best video only if needed
			if (topFormats.length < 3 && videoOnly.length > 0) {
				for (const f of videoOnly) {
					if (topFormats.length >= 3) break;
					if (!topFormats.includes(f)) topFormats.push(f);
				}
			}

			const downloadLink = topFormats.length > 0 ? topFormats[0].url : "";

			return NextResponse.json({
				success: true,
				title: title,
				thumbnail: thumbnail,
				downloadLink: downloadLink,
				formats: topFormats,
			});
		} catch (ytError: any) {
			console.error("[Downloader] yt-dlp execution failed:", ytError);

			let errorMessage = "Failed to process video with yt-dlp.";
			if (
				ytError.message?.includes(
					"Sign in to confirm you’re not a bot",
				) ||
				ytError.message?.includes(
					"Instagram API is not granting access",
				) ||
				ytError.message?.includes("cookies are no longer valid")
			) {
				const platformName = platform
					? platform.charAt(0).toUpperCase() + platform.slice(1)
					: "Platform";
				errorMessage = `${platformName} has blocked this request due to bot detection or IP restrictions. If you added cookies, they might have expired. Try another link or provide fresh YOUTUBE_COOKIES.`;
			}

			return NextResponse.json(
				{
					error: errorMessage,
					details: ytError.message,
				},
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error("[Downloader] Global Error:", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred. Please try again." },
			{ status: 500 },
		);
	}
}

function detectPlatform(url: string): string | null {
	const lowerUrl = url.toLowerCase();
	if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be"))
		return "youtube";
	if (lowerUrl.includes("instagram.com") || lowerUrl.includes("instagr.am"))
		return "instagram";
	if (
		lowerUrl.includes("facebook.com") ||
		lowerUrl.includes("fb.watch") ||
		lowerUrl.includes("fb.com")
	)
		return "facebook";
	if (lowerUrl.includes("tiktok.com")) return "tiktok";
	if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com"))
		return "twitter";
	return null;
}
