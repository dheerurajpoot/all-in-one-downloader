import { NextRequest, NextResponse } from "next/server";
import { Innertube } from "youtubei.js";

export async function GET(request: NextRequest) {
	const url = request.nextUrl.searchParams.get("url");
	const title = request.nextUrl.searchParams.get("title") || "video";

	if (!url) {
		return NextResponse.json({ error: "URL is required" }, { status: 400 });
	}

	try {
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

		console.log(`[Proxy] Fetching: ${url.substring(0, 50)}...`);
		
		const response = await fetch(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
				Accept: "*/*",
				"Accept-Language": "en-US,en;q=0.9",
				Connection: "keep-alive",
				Referer: referer,
				Origin: origin,
			},
		});

		if (!response.ok) {
			console.error(`[Proxy] Fetch failed with status ${response.status}`);
			return NextResponse.json(
				{ error: "Failed to fetch video from remote servers" },
				{ status: response.status },
			);
		}

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
