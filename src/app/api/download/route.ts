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

		// --- STRATEGY 1: YouTube ---
		if (platform === "youtube") {
			const videoId = videoUrl.includes("v=")
				? videoUrl.split("v=")[1].split("&")[0]
				: videoUrl.split("/").pop();

			try {
				// 1. Try youtubei.js first for metadata (very reliable for info)
				if (videoId) {
					const youtube = await Innertube.create();
					const info = await youtube.getInfo(videoId);
					const formats = [
						...(info.streaming_data?.formats || []),
						...(info.streaming_data?.adaptive_formats || []),
					];

					if (formats.length > 0) {
						const title = info.basic_info.title || "YouTube Video";
						const bestFormat = info.chooseFormat({
							type: "video+audio",
							quality: "best",
						});
						const primaryUrl =
							bestFormat?.url || formats[0].url || "";
						const isPrimaryGoogleVideo =
							primaryUrl.includes("googlevideo.com");

						return NextResponse.json({
							success: true,
							title: title,
							thumbnail:
								info.basic_info.thumbnail?.[0]?.url || "",
							downloadLink: isPrimaryGoogleVideo
								? `/api/proxy?url=${encodeURIComponent(primaryUrl)}&title=${encodeURIComponent(title)}&type=youtube&id=${videoId}&platform=youtube`
								: `/api/proxy?url=${encodeURIComponent(primaryUrl)}&title=${encodeURIComponent(title)}&platform=youtube`,
							formats: formats
								.filter((f: any) => f.url)
								.map((f: any) => {
									const isGoogleVideo =
										f.url.includes("googlevideo.com");
									const proxyUrl = `/api/proxy?url=${encodeURIComponent(f.url)}&title=${encodeURIComponent(title)}&type=youtube&id=${videoId}&platform=youtube`;
									return {
										quality:
											f.quality_label ||
											f.quality ||
											`${f.width}p`,
										url: isGoogleVideo
											? proxyUrl
											: `/api/proxy?url=${encodeURIComponent(f.url)}&title=${encodeURIComponent(title)}&platform=youtube`,
										size: f.content_length
											? `${(Number(f.content_length) / 1048576).toFixed(2)} MB`
											: undefined,
									};
								}),
						});
					}
				}
			} catch (e) {
				console.error(
					"[Downloader] YouTube youtubei.js Info Failed:",
					e,
				);
			}

			// 2. Fallback to Cobalt for YouTube if youtubei.js fails
			const ytInstances = [
				"https://cobalt.meowing.de/",
				"https://cobalt.qwedl.com/",
				"https://cobalt.draco.sh/",
				"https://cobalt-backend.canine.tools/",
				"https://cobalt.v07.me/",
				"https://cobalt.api.unblocked.lol/",
				"https://cobalt.api.3kh0.net/",
				"https://cobalt.tools/",
			];

			for (const instance of ytInstances) {
				try {
					const response = await fetchWithTimeout(
						instance,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Accept: "application/json",
							},
							body: JSON.stringify({
								url: videoUrl,
								videoQuality: "720",
								downloadMode: "auto",
							}),
						},
						5000,
					);
					if (response.ok) {
						const data = await response.json();
						if (data.status !== "error" && data.url) {
							return NextResponse.json({
								success: true,
								title: data.text || "YouTube Video",
								downloadLink: `/api/proxy?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.text || "video")}&type=youtube&id=${videoId}&platform=youtube`,
								picker: data.picker || [],
							});
						}
					}
				} catch {
					continue;
				}
			}
		}

		// --- STRATEGY 2: Instagram, Facebook, TikTok (Prioritize Cobalt/TikWM) ---
		if (
			platform === "instagram" ||
			platform === "facebook" ||
			platform === "tiktok"
		) {
			try {
				console.log(`[Downloader] Trying Cobalt for ${platform}...`);
				const instances = [
					"https://cobalt.meowing.de/",
					"https://cobalt.qwedl.com/",
					"https://cobalt.draco.sh/",
					"https://cobalt-backend.canine.tools/",
					"https://cobalt.v07.me/",
					"https://cobalt.api.unblocked.lol/",
				];

				for (const instance of instances) {
					try {
						const response = await fetchWithTimeout(
							instance,
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
									Accept: "application/json",
								},
								body: JSON.stringify({
									url: videoUrl,
									videoQuality: "1080",
									downloadMode: "auto",
								}),
							},
							7000,
						);
						if (response.ok) {
							const data = await response.json();
							if (data.status !== "error" && data.url) {
								const title =
									data.text ||
									`${platform.charAt(0).toUpperCase() + platform.slice(1)} Video`;
								return NextResponse.json({
									success: true,
									title: title,
									downloadLink: `/api/proxy?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(title)}&platform=${platform}`,
									picker: data.picker || [],
								});
							}
						}
					} catch {
						continue;
					}
				}
			} catch (e) {
				console.error(`[Downloader] Cobalt ${platform} Failed:`, e);
			}

			// Special Fallback for Facebook/Instagram
			if (platform === "facebook" || platform === "instagram") {
				try {
					console.log(
						`[Downloader] Trying Snapsave/Direct fallback for ${platform}...`,
					);
					const snapsaveRes = await fetchWithTimeout(
						`https://api.v07.me/api/${platform}/info?url=${encodeURIComponent(videoUrl)}`,
						{},
						10000,
					);
					const snapsaveData = await snapsaveRes.json();
					if (snapsaveData && snapsaveData.url) {
						const title = snapsaveData.title || `${platform} Video`;
						return NextResponse.json({
							success: true,
							title: title,
							thumbnail: snapsaveData.thumbnail || "",
							downloadLink: `/api/proxy?url=${encodeURIComponent(snapsaveData.url)}&title=${encodeURIComponent(title)}&platform=${platform}`,
							formats: [
								{
									quality: "HD",
									url: `/api/proxy?url=${encodeURIComponent(snapsaveData.url)}&title=${encodeURIComponent(title)}&platform=${platform}`,
								},
							],
						});
					}
				} catch {
					/* ignore */
				}
			}

			// Fallback to TikWM for these platforms
			try {
				const tikwmRes = await fetchWithTimeout(
					`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`,
				);
				const tikwmData = await tikwmRes.json();

				if (tikwmData.code === 0 && tikwmData.data) {
					const data = tikwmData.data;
					const title =
						data.title ||
						`${platform.charAt(0).toUpperCase() + platform.slice(1)} Video`;
					const bestUrl =
						data.hdplay ||
						data.play ||
						data.wmplay ||
						(data.images ? data.images[0] : "");

					return NextResponse.json({
						success: true,
						title: title,
						thumbnail: data.cover || "",
						downloadLink: bestUrl
							? `/api/proxy?url=${encodeURIComponent(bestUrl)}&title=${encodeURIComponent(title)}&platform=${platform}`
							: "",
						formats: data.images
							? data.images.map((img: string, i: number) => ({
									quality: `Image ${i + 1}`,
									url: `/api/proxy?url=${encodeURIComponent(img)}&title=${encodeURIComponent(title + " Image " + (i + 1))}&platform=${platform}`,
								}))
							: [
									{
										quality: "HD Video",
										url: data.hdplay
											? `/api/proxy?url=${encodeURIComponent(data.hdplay)}&title=${encodeURIComponent(title)}&platform=${platform}`
											: "",
									},
									{
										quality: "SD Video",
										url: data.play
											? `/api/proxy?url=${encodeURIComponent(data.play)}&title=${encodeURIComponent(title)}&platform=${platform}`
											: "",
									},
								].filter((f) => f.url),
					});
				}
			} catch (e) {
				console.error("[Downloader] TikWM Strategy Failed:", e);
			}
		}

		// --- STRATEGY 3: Universal Fallback (Any4K / Cobalt) ---
		// Fallback A: Any4K
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
						deviceId: "12345678901234567890123456789012",
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
					formats: d.download?.map((f: any) => ({
						quality: f.res_text,
						url: f.url,
						size: f.filesize
							? `${(f.filesize / 1048576).toFixed(2)} MB`
							: undefined,
					})),
				});
			}
		} catch {
			/* ignore */
		}

		// Fallback B: Universal Cobalt
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
