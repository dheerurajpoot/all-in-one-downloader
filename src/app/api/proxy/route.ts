import { NextRequest, NextResponse } from "next/server";
import { Innertube } from "youtubei.js";

export async function GET(request: NextRequest) {
	const url = request.nextUrl.searchParams.get("url");
	const title = request.nextUrl.searchParams.get("title") || "video";
	const type = request.nextUrl.searchParams.get("type"); // 'youtube' or null

	if (!url) {
		return NextResponse.json({ error: "URL is required" }, { status: 400 });
	}

	try {
		// --- SPECIAL HANDLING FOR YOUTUBE ---
		if (type === "youtube" || url.includes("googlevideo.com")) {
			try {
				const videoId = request.nextUrl.searchParams.get("id");

				if (videoId) {
					console.log(`[Proxy] Streaming YouTube video directly: ${videoId}`);
					const youtube = await Innertube.create();
					
					// Use download method directly which returns a ReadableStream
					const stream = await youtube.download(videoId, {
						type: "video+audio",
						quality: "best",
						format: "mp4",
					});

					if (stream) {
						const headers = new Headers();
						headers.set(
							"Content-Disposition",
							`attachment; filename="${encodeURIComponent(title)}.mp4"`,
						);
						headers.set("Content-Type", "video/mp4");
						// We don't have Content-Length for direct streaming usually
						return new NextResponse(stream as any, {
							status: 200,
							headers,
						});
					}
				}
			} catch (ytError: any) {
				console.error("[Proxy] YouTube Streaming Error:", ytError.message);
			}
		}

		// --- STANDARD PROXY FETCH ---
		const platform = request.nextUrl.searchParams.get("platform");
		let referer = "https://www.google.com/";
		let origin = "https://www.google.com";

		if (platform === "instagram") {
			referer = "https://www.instagram.com/";
			origin = "https://www.instagram.com";
		} else if (platform === "facebook") {
			referer = "https://www.facebook.com/";
			origin = "https://www.facebook.com";
		} else if (platform === "tiktok") {
			referer = "https://www.tiktok.com/";
			origin = "https://www.tiktok.com";
		} else if (platform === "youtube") {
			referer = "https://www.youtube.com/";
			origin = "https://www.youtube.com";
		}

		console.log(`[Proxy] Fetching: ${url.substring(0, 50)}... with referer: ${referer}`);
		const response = await fetch(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
				Accept: "*/*",
				"Accept-Language": "en-US,en;q=0.9",
				Connection: "keep-alive",
				Referer: referer,
				Origin: origin,
				"Sec-Fetch-Dest": "video",
				"Sec-Fetch-Mode": "cors",
				"Sec-Fetch-Site": "cross-site",
			},
		});

		if (!response.ok) {
			const errorText = await response.text().catch(() => "No error body");
			console.error(`[Proxy] Fetch failed with status ${response.status}: ${errorText}`);
			
			// If it's a 403 or 404, let's try one more time with even more basic headers
			if (response.status === 403 || response.status === 404) {
				const retryResponse = await fetch(url, {
					headers: {
						"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
					}
				});
				if (retryResponse.ok) {
					const headers = new Headers();
					headers.set("Content-Disposition", `attachment; filename="${encodeURIComponent(title)}.mp4"`);
					headers.set("Content-Type", retryResponse.headers.get("Content-Type") || "video/mp4");
					const contentLength = retryResponse.headers.get("Content-Length");
					if (contentLength) headers.set("Content-Length", contentLength);
					return new NextResponse(retryResponse.body, { status: 200, headers });
				}
			}

			return NextResponse.json(
				{ 
					error: "Failed to fetch video from remote servers", 
					status: response.status,
				},
				{ status: response.status },
			);
		}

		// Create a new response with the stream and correct headers
		const headers = new Headers();
		headers.set(
			"Content-Disposition",
			`attachment; filename="${encodeURIComponent(title)}.mp4"`,
		);
		headers.set(
			"Content-Type",
			response.headers.get("Content-Type") || "video/mp4",
		);
		const contentLength = response.headers.get("Content-Length");
		if (contentLength) {
			headers.set("Content-Length", contentLength);
		}

		return new NextResponse(response.body, {
			status: 200,
			headers,
		});
	} catch (error: any) {
		console.error("[Proxy] Error:", error);
		return NextResponse.json(
			{ error: "Failed to proxy video stream" },
			{ status: 500 },
		);
	}
}
