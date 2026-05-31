import { NextRequest, NextResponse } from "next/server";
import { Innertube } from "youtubei.js";

async function fetchWithTimeout(
	resource: string,
	options: any = {},
	timeout = 8000,
) {
	const { signal, ...rest } = options;
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);
	try {
		const response = await fetch(resource, {
			...rest,
			signal: controller.signal,
		});
		clearTimeout(id);
		return response;
	} catch (error) {
		clearTimeout(id);
		throw error;
	}
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

		// --- STRATEGY 1: YouTube (Prioritize Cobalt for downloadable links) ---
		if (platform === "youtube") {
			try {
				console.log("[Downloader] Trying Cobalt for YouTube...");
				const ytInstances = [
					"https://cobalt.meowing.de/",
					"https://cobalt.qwedl.com/",
					"https://cobalt.draco.sh/",
					"https://cobalt-backend.canine.tools/",
				];

				for (const instance of ytInstances) {
					try {
						const response = await fetchWithTimeout(instance, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Accept: "application/json",
							},
							body: JSON.stringify({
								url: videoUrl,
								videoQuality: "720",
								audioFormat: "mp3",
								downloadMode: "auto",
							}),
						});
						if (response.ok) {
							const data = await response.json();
							if (data.status !== "error" && data.url) {
								return NextResponse.json({
									success: true,
									title: data.text || "YouTube Video",
									downloadLink: data.url,
									picker: data.picker || [],
								});
							}
						}
					} catch (err) {
						continue;
					}
				}

				// If Cobalt fails, try a direct YT-DLP based API which is often more stable than youtubei.js
				try {
					console.log("[Downloader] Trying alternate YouTube API...");
					const altRes = await fetchWithTimeout(
						`https://api.v07.me/api/yt/info?url=${encodeURIComponent(videoUrl)}`,
						{},
						10000,
					);
					const altData = await altRes.json();
					if (altData && altData.url) {
						return NextResponse.json({
							success: true,
							title: altData.title || "YouTube Video",
							thumbnail: altData.thumbnail || "",
							downloadLink: altData.url,
							formats: [
								{
									quality: "Best Quality",
									url: altData.url,
								},
							],
						});
					}
				} catch {
					/* ignore and try next */
				}

				// If everything else fails, try youtubei.js but warn about potential 403
				console.log(
					"[Downloader] Alternate APIs failed, falling back to youtubei.js...",
				);
				const youtube = await Innertube.create();
				const videoId = videoUrl.includes("v=")
					? videoUrl.split("v=")[1].split("&")[0]
					: videoUrl.split("/").pop();

				if (!videoId) throw new Error("Could not extract Video ID");

				const info = await youtube.getInfo(videoId);
				const formats = [
					...(info.streaming_data?.formats || []),
					...(info.streaming_data?.adaptive_formats || []),
				];

				if (formats.length > 0) {
					const bestFormat = info.chooseFormat({
						type: "video+audio",
						quality: "best",
					});
					const primaryUrl = bestFormat?.url || formats[0].url || "";
					const isPrimaryGoogleVideo =
						primaryUrl.includes("googlevideo.com");
					const title = info.basic_info.title || "video";

					return NextResponse.json({
						success: true,
						title: title,
						thumbnail: info.basic_info.thumbnail?.[0]?.url || "",
						downloadLink: isPrimaryGoogleVideo
							? `/api/proxy?url=${encodeURIComponent(primaryUrl)}&title=${encodeURIComponent(title)}`
							: primaryUrl,
						formats: formats
							.filter((f: any) => f.url)
							.map((f: any) => {
								const isGoogleVideo =
									f.url.includes("googlevideo.com");
								const proxyUrl = `/api/proxy?url=${encodeURIComponent(f.url)}&title=${encodeURIComponent(info.basic_info.title || "video")}`;
								return {
									quality:
										f.quality_label ||
										f.quality ||
										`${f.width}p`,
									url: isGoogleVideo ? proxyUrl : f.url,
									size: f.content_length
										? `${(Number(f.content_length) / 1048576).toFixed(2)} MB`
										: undefined,
								};
							}),
					});
				}
			} catch (e) {
				console.error("[Downloader] YouTube Strategy Failed:", e);
				// Final safety net: FabDL
				try {
					const ytApi = await fetchWithTimeout(
						`https://api.fabdl.com/youtube/get-video-info?url=${encodeURIComponent(videoUrl)}`,
						{
							headers: {
								"User-Agent":
									"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
							},
						},
					);
					const ytData = await ytApi.json();
					if (ytData.result) {
						return NextResponse.json({
							success: true,
							title: ytData.result.title,
							thumbnail: ytData.result.image,
							downloadLink: ytData.result.download_url,
							formats:
								ytData.result.links?.map(
									(l: {
										label: string;
										url: string;
										size?: string;
									}) => ({
										quality: l.label,
										url: l.url,
										size: l.size,
									}),
								) || [],
						});
					}
				} catch (fallbackError) {
					console.error(
						"[Downloader] YouTube Fallback Failed:",
						fallbackError,
					);
				}
			}
		}

		// --- STRATEGY 2: Instagram, Facebook, TikTok (TikWM) ---
		// This is a free, no-key API that is currently very stable for these platforms.
		if (
			platform === "instagram" ||
			platform === "facebook" ||
			platform === "tiktok"
		) {
			try {
				const tikwmRes = await fetchWithTimeout(
					`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`,
				);
				const tikwmData = await tikwmRes.json();

				if (tikwmData.code === 0 && tikwmData.data) {
					const data = tikwmData.data;
					return NextResponse.json({
						success: true,
						title:
							data.title ||
							`${platform.charAt(0).toUpperCase() + platform.slice(1)} Video`,
						thumbnail: data.cover || "",
						downloadLink: data.play || data.hdplay || data.wmplay,
						status: "stream",
						quality: data.hdplay ? "HD" : "SD",
					});
				}
			} catch (e) {
				console.error("[Downloader] TikWM Strategy Failed:", e);
			}
		}

		// --- STRATEGY 3: Universal Fallback (Any4K / Cobalt) ---
		// Fallback A: Any4K (with more parameters to avoid validation errors)
		try {
			const any4kRes = await fetchWithTimeout(
				"https://api.any4k.com/v1/dlp/check",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						url: videoUrl,
						lang: "en",
						country: "US",
						platform: "Web",
						deviceId: "12345678901234567890123456789012", // 32 chars
						sysVer: "10",
						appVer: "1.0.0",
						bundleId: "com.any4k.web",
					}),
				},
			);
			const any4kData = await any4kRes.json();
			if (any4kData.err_code === 0 && any4kData.data) {
				const d = any4kData.data;
				return NextResponse.json({
					success: true,
					title: d.title || "Video",
					thumbnail: d.thumbnail || "",
					downloadLink: d.download?.[0]?.url || d.raw_video?.[0]?.url,
					formats: d.download?.map(
						(f: {
							res_text: string;
							url: string;
							filesize?: number;
						}) => ({
							quality: f.res_text,
							url: f.url,
							size: f.filesize
								? `${(f.filesize / 1048576).toFixed(2)} MB`
								: undefined,
						}),
					),
				});
			}
		} catch {
			/* ignore and try next */
		}

		// Fallback B: Cobalt Rotation (Updated instances and parameters for V10)
		const instances = [
			"https://cobalt.meowing.de/",
			"https://cobalt.qwedl.com/",
			"https://cobalt.draco.sh/",
			"https://cobalt-backend.canine.tools/",
		];
		for (const instance of instances) {
			try {
				const response = await fetchWithTimeout(instance, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify({
						url: videoUrl,
						videoQuality: "720",
						audioFormat: "mp3",
						downloadMode: "auto",
					}),
				});
				if (response.ok) {
					const data = await response.json();
					if (data.status !== "error" && data.url) {
						return NextResponse.json({
							success: true,
							title: data.text || "Downloaded Video",
							downloadLink: data.url,
							picker: data.picker || [],
						});
					}
				}
			} catch {
				continue;
			}
		}

		return NextResponse.json(
			{
				error: "The service is currently unable to process this link. This usually happens with private videos or platform restrictions. Please try another link.",
			},
			{ status: 500 },
		);
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
	if (lowerUrl.includes("instagram.com")) return "instagram";
	if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.watch"))
		return "facebook";
	if (lowerUrl.includes("tiktok.com")) return "tiktok";
	if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com"))
		return "twitter";
	return null;
}
