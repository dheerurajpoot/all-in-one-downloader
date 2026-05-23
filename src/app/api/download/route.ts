import { NextRequest, NextResponse } from "next/server";

// IMPORTANT: Set your RapidAPI key in your environment variables as RAPIDAPI_KEY
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "social-media-video-downloader.p.rapidapi.com";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { url } = body;

		if (!url) {
			return NextResponse.json(
				{ error: "URL is required" },
				{ status: 400 },
			);
		}

		if (!RAPIDAPI_KEY) {
			console.error(
				"[Downloader] Missing RAPIDAPI_KEY environment variable",
			);
			return NextResponse.json(
				{ error: "Server configuration error: Missing API Key." },
				{ status: 500 },
			);
		}

		// Validate URL format
		const urlPattern = /^https?:\/\//i;
		if (!urlPattern.test(url)) {
			return NextResponse.json(
				{ error: "Invalid URL format" },
				{ status: 400 },
			);
		}

		// Call RapidAPI - Social Media Video Downloader
		const options = {
			method: "POST",
			headers: {
				"x-rapidapi-key": RAPIDAPI_KEY,
				"x-rapidapi-host": RAPIDAPI_HOST,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url }),
		};

		const response = await fetch(`https://${RAPIDAPI_HOST}/smvd/get/all`, {
			method: "POST",
			headers: options.headers,
			body: options.body,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error("[Downloader] RapidAPI Error:", errorData);
			return NextResponse.json(
				{
					error: "Failed to process video. The URL might be invalid or the service is down.",
				},
				{ status: response.status },
			);
		}

		const data = await response.json();

		if (!data || !data.success) {
			return NextResponse.json(
				{
					error:
						data?.message || "Failed to extract video information.",
				},
				{ status: 400 },
			);
		}

		// Format the RapidAPI response for our frontend
		// This API typically returns title, thumbnail, and a list of links (quality/url)
		const formattedData = {
			success: true,
			title: data.title || "Downloaded Video",
			thumbnail: data.thumbnail || "",
			downloadLink: data.links?.[0]?.link || data.url,
			formats:
				data.links?.map(
					(l: { quality: string; link: string; size?: string }) => ({
						quality: l.quality,
						url: l.link,
						size: l.size,
					}),
				) || [],
		};

		return NextResponse.json(formattedData);
	} catch (error) {
		console.error("[Downloader] Global Error:", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred. Please try again." },
			{ status: 500 },
		);
	}
}
