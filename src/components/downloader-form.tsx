"use client";

import { useState } from "react";
import Image from "next/image";
import {
	AlertCircle,
	CheckCircle,
	Download as DownloadIcon,
	Loader2,
	Copy,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";

interface DownloadResponse {
	success: boolean;
	error?: string;
	title?: string;
	thumbnail?: string;
	formats?: Array<{
		quality: string;
		url: string;
		size?: string;
	}>;
	downloadLink?: string;
	downloadLinks?: Array<{
		quality: string;
		url: string;
	}>;
	quality?: string;
}

export function DownloaderForm() {
	const [url, setUrl] = useState("");
	const [platform, setPlatform] = useState("youtube");
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<DownloadResponse | null>(null);
	const [error, setError] = useState("");
	const [selectedQuality, setSelectedQuality] = useState<string>("");

	const platforms = [
		{ id: "youtube", label: "YouTube", icon: "▶️" },
		{ id: "instagram", label: "Instagram", icon: "📸" },
		{ id: "facebook", label: "Facebook", icon: "👤" },
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setResponse(null);
		setSelectedQuality("");

		if (!url.trim()) {
			setError("Please enter a valid URL");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("/api/download", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url: url.trim(), platform }),
			});

			const data = await res.json();

			if (!res.ok || !data.success) {
				setError(data.error || "Failed to process video");
				return;
			}

			setResponse(data);

			// Set default quality selection
			if (data.formats && data.formats.length > 0) {
				setSelectedQuality(data.formats[0].url);
			} else if (data.downloadLink) {
				setSelectedQuality(data.downloadLink);
			} else if (data.downloadLinks && data.downloadLinks.length > 0) {
				setSelectedQuality(data.downloadLinks[0].url);
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
			console.error("[v0] Error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDownload = (downloadUrl: string) => {
		if (!downloadUrl) return;

		// Open download link in new tab
		const link = document.createElement("a");
		link.href = downloadUrl;
		link.target = "_blank";
		link.rel = "noopener noreferrer";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleCopyUrl = () => {
		if (selectedQuality) {
			navigator.clipboard.writeText(selectedQuality);
		}
	};

	return (
		<div className='w-full max-w-2xl mx-auto'>
			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* Platform Selection */}
				<div>
					<label className='block text-sm font-semibold text-foreground mb-3'>
						Select Platform
					</label>
					<div className='grid grid-cols-3 gap-3'>
						{platforms.map((p) => (
							<button
								key={p.id}
								type='button'
								onClick={() => setPlatform(p.id)}
								className={`p-4 rounded-lg border-2 transition-all font-medium flex flex-col items-center gap-2 ${
									platform === p.id
										? "border-primary bg-primary/10 text-primary"
										: "border-border bg-muted hover:border-primary/50 text-foreground"
								}`}>
								<span className='text-2xl'>{p.icon}</span>
								{p.label}
							</button>
						))}
					</div>
				</div>

				{/* URL Input */}
				<div>
					<label
						htmlFor='url'
						className='block text-sm font-semibold text-foreground mb-2'>
						Enter Video URL
					</label>
					<Input
						id='url'
						type='url'
						placeholder={`Paste your ${platforms.find((p) => p.id === platform)?.label} video URL here...`}
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						className='w-full'
						disabled={loading}
					/>
					<p className='text-xs text-muted-foreground mt-2'>
						Paste the direct link to your video. Works with posts,
						reels, shorts, and more.
					</p>
				</div>

				{/* Submit Button */}
				<Button
					type='submit'
					disabled={loading}
					className='w-full h-11 text-base font-semibold'>
					{loading ? (
						<>
							<Loader2 className='mr-2 h-5 w-5 animate-spin' />
							Processing...
						</>
					) : (
						<>
							<DownloadIcon className='mr-2 h-5 w-5' />
							Download Video
						</>
					)}
				</Button>

				{/* Error Alert */}
				{error && (
					<Alert variant='destructive'>
						<AlertCircle className='h-4 w-4' />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{/* Success Response */}
				{response?.success && (
					<div className='space-y-4 p-6 bg-muted/50 rounded-lg border border-border'>
						<div className='flex items-center gap-2 text-green-600'>
							<CheckCircle className='h-5 w-5' />
							<p className='font-semibold'>
								Video processed successfully!
							</p>
						</div>

						{response.title && (
							<div>
								<p className='text-sm text-muted-foreground mb-1'>
									Title
								</p>
								<p className='text-foreground font-medium'>
									{response.title}
								</p>
							</div>
						)}

						{response.thumbnail && (
							<div>
								<p className='text-sm text-muted-foreground mb-2'>
									Thumbnail
								</p>
								<Image
									src={response.thumbnail}
									alt='Video thumbnail'
									width={320}
									height={180}
									unoptimized
									className='w-full max-w-xs rounded-lg'
								/>
							</div>
						)}

						{/* Quality Selection */}
						{response.formats?.length ||
						response.downloadLinks?.length ? (
							<div>
								<label className='block text-sm font-semibold text-foreground mb-3'>
									Select Quality
								</label>
								<div className='space-y-2'>
									{(
										response.formats ||
										response.downloadLinks ||
										[]
									).map(
										(
											format: {
												url: string;
												quality?: string;
												size?: string;
											},
											idx: number,
										) => (
											<button
												key={idx}
												type='button'
												onClick={() =>
													setSelectedQuality(
														format.url,
													)
												}
												className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
													selectedQuality ===
													format.url
														? "border-primary bg-primary/10"
														: "border-border hover:border-primary/50"
												}`}>
												<div className='flex items-center justify-between'>
													<div>
														<p className='font-medium text-foreground'>
															{format.quality ||
																`Quality ${idx + 1}`}
														</p>
														{format.size && (
															<p className='text-xs text-muted-foreground'>
																{format.size}
															</p>
														)}
													</div>
													<div className='w-5 h-5 rounded border-2 border-primary flex items-center justify-center'>
														{selectedQuality ===
															format.url && (
															<div className='w-3 h-3 rounded bg-primary' />
														)}
													</div>
												</div>
											</button>
										),
									)}
								</div>
							</div>
						) : null}

						{/* Download Link Direct */}
						{response.downloadLink && !response.formats && (
							<div>
								<p className='text-sm text-muted-foreground mb-2'>
									Quality: {response.quality}
								</p>
							</div>
						)}

						{/* Action Buttons */}
						<div className='flex gap-3 pt-4'>
							<Button
								onClick={() =>
									handleDownload(
										selectedQuality ||
											response.downloadLink ||
											"",
									)
								}
								disabled={
									!selectedQuality && !response.downloadLink
								}
								className='flex-1'>
								<DownloadIcon className='mr-2 h-5 w-5' />
								Download
							</Button>
							<Button
								variant='outline'
								onClick={handleCopyUrl}
								disabled={
									!selectedQuality && !response.downloadLink
								}
								className='flex-1'>
								<Copy className='mr-2 h-5 w-5' />
								Copy Link
							</Button>
						</div>
					</div>
				)}
			</form>
		</div>
	);
}
