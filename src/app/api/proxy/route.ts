import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const url = request.nextUrl.searchParams.get("url");
	const title = request.nextUrl.searchParams.get("title") || "video";

	if (!url) {
		return NextResponse.json({ error: "URL is required" }, { status: 400 });
	}

	try {
		const response = await fetch(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Accept: "*/*",
				"Accept-Encoding": "identity",
				Connection: "keep-alive",
				Referer: "https://www.youtube.com/",
			},
		});

		if (!response.ok) {
			const errorText = await response.text().catch(() => "No error body");
			console.error(`[Proxy] Fetch failed with status ${response.status}: ${errorText}`);
			return NextResponse.json(
				{ 
					error: "Failed to fetch video from YouTube servers", 
					status: response.status,
					details: errorText.substring(0, 100)
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
