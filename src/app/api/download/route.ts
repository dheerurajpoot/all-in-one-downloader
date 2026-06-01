import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execFilePromise = promisify(execFile);

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
			// 1. Check for local binary in bin/ folder (for production/Vercel)
			// 2. Fallback to system 'yt-dlp' (for localhost)
			const localBinaryPath = path.join(process.cwd(), "bin", "yt-dlp");
			let binaryToUse = "yt-dlp";

			// Only use the bundled binary if we are on Linux (Vercel/Production)
			// On macOS/Windows (Local Dev), we use the system yt-dlp
			if (
				process.platform === "linux" &&
				fs.existsSync(localBinaryPath)
			) {
				binaryToUse = localBinaryPath;
				console.log(
					`[Downloader] Using local Linux binary: ${binaryToUse}`,
				);
			} else {
				console.log(
					`[Downloader] Using system binary (platform: ${process.platform})`,
				);
			}

			// Using yt-dlp to get video information
			// --dump-json: output metadata as JSON
			// --no-playlist: only get information for the video, not the whole playlist

			let ytDlpArgs = [
				"--dump-json",
				"--no-playlist",
				"--user-agent",
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
			];

			// Add specific workarounds based on platform
			if (platform === "youtube") {
				// Use multiple clients and skip webpage to bypass bot detection
				ytDlpArgs.push(
					"--extractor-args",
					"youtube:player_client=tv,android,ios,web_embedded",
					"--no-check-certificates",
					"--geo-bypass",
					"--force-ipv4",
				);
			} else if (platform === "instagram") {
				// Instagram specific arguments
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

			// Add the URL as the last argument
			ytDlpArgs.push(videoUrl);

			const { stdout, stderr } = await execFilePromise(
				binaryToUse,
				ytDlpArgs,
				{ timeout: 30000, maxBuffer: 10 * 1024 * 1024 }, // 30s timeout, 10MB buffer
			);

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
			// We prefer formats with both video and audio, or the best available
			const formats = info.formats
				.filter(
					(f: any) =>
						f.url && (f.vcodec !== "none" || f.acodec !== "none"),
				)
				.map((f: any) => {
					let quality =
						f.format_note ||
						f.resolution ||
						`${f.width}p` ||
						f.format_id;
					if (f.vcodec !== "none" && f.acodec !== "none") {
						quality += " (Video + Audio)";
					} else if (f.vcodec !== "none") {
						quality += " (Video only)";
					} else if (f.acodec !== "none") {
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
					};
				})
				.reverse(); // Often best qualities are at the end

			// Find a good default download link (best combined format if possible)
			const bestCombined = info.formats
				.filter(
					(f: any) =>
						f.url && f.vcodec !== "none" && f.acodec !== "none",
				)
				.pop();

			const downloadLink = bestCombined
				? `/api/proxy?url=${encodeURIComponent(bestCombined.url)}&title=${encodeURIComponent(title)}&platform=${platform}`
				: formats.length > 0
					? formats[0].url
					: "";

			return NextResponse.json({
				success: true,
				title: title,
				thumbnail: thumbnail,
				downloadLink: downloadLink,
				formats: formats.slice(0, 15), // Limit to top 15 formats
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
				)
			) {
				const platformName = platform
					? platform.charAt(0).toUpperCase() + platform.slice(1)
					: "Platform";
				errorMessage = `${platformName} has blocked this request due to bot detection or IP restrictions. Try another link or try again later.`;
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
