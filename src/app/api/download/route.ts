import { NextRequest, NextResponse } from "next/server";

// Using RapidAPI's video download service
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "demo";
const RAPIDAPI_HOST = "social-media-video-downloader.p.rapidapi.com";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { url, platform } = body;

		if (!url || !platform) {
			return NextResponse.json(
				{ error: "URL and platform are required" },
				{ status: 400 },
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

		// Call RapidAPI endpoint
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-rapidapi-key": RAPIDAPI_KEY,
				"x-rapidapi-host": RAPIDAPI_HOST,
			},
			body: JSON.stringify({ url }),
		};

		const response = await fetch(
			`https://${RAPIDAPI_HOST}/download`,
			options,
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error("[v0] API Error:", errorData);
			return NextResponse.json(
				{
					error: "Failed to process video. The URL might be invalid or the video is unavailable.",
				},
				{ status: response.status },
			);
		}

		const data = await response.json();

		// Format response based on platform
		const formattedData = formatResponse(data, platform);

		return NextResponse.json(formattedData);
	} catch (error) {
		console.error("[v0] Download API Error:", error);
		return NextResponse.json(
			{
				error: "An error occurred while processing your request. Please try again.",
			},
			{ status: 500 },
		);
	}
}

function formatResponse(data: Record<string, unknown>, platform: string) {
	// Handle different API response formats
	if (data.error) {
		return {
			error: data.error,
			success: false,
		};
	}

	// YouTube format
	if (platform === "youtube") {
		return {
			success: true,
			title: data.title || "Video",
			thumbnail: data.thumbnail || "",
			formats: data.formats || [],
			downloadLinks: data.links || [],
		};
	}

	// Instagram format
	if (platform === "instagram") {
		return {
			success: true,
			title: "Instagram Video",
			formats: data.formats || [],
			downloadLink: data.download_link || data.url || "",
			quality: data.quality || "HD",
		};
	}

	// Facebook format
	if (platform === "facebook") {
		return {
			success: true,
			title: "Facebook Video",
			formats: data.formats || [],
			downloadLink: data.download_link || data.url || "",
			quality: data.quality || "HD",
		};
	}

	return {
		success: true,
		data: data,
	};
}
