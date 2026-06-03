"use client";

import { useState } from "react";
import Image from "next/image";
import {
	AlertCircle,
	CheckCircle,
	Download as DownloadIcon,
	Loader2,
	Copy,
	Link as LinkIcon,
	Zap,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { useToast } from "./ui/use-toast";

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
	picker?: Array<{
		url: string;
		thumb?: string;
		type?: string;
	}>;
}

export function DownloaderForm() {
	const { toast } = useToast();
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<DownloadResponse | null>(null);
	const [error, setError] = useState("");
	const [selectedQuality, setSelectedQuality] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setResponse(null);
		setSelectedQuality("");

		const trimmedUrl = url.trim().replace(/[`"'\s]/g, "");
		if (!trimmedUrl) {
			setError("Please enter a valid URL");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("/api/download", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url: trimmedUrl }),
			});

			const data = await res.json();

			if (!res.ok || !data.success) {
				const errorMessage = data.error || "Failed to process video";
				const details =
					data.details?.message || data.details?.error || "";
				const fullError = details
					? `${errorMessage}: ${details}`
					: errorMessage;
				setError(fullError);
				toast({
					title: "Error",
					description: fullError,
					variant: "destructive",
				});
				return;
			}

			setResponse(data);
			toast({
				title: "Success",
				description: "Video information retrieved successfully!",
			});

			// Set default quality selection
			if (data.formats && data.formats.length > 0) {
				setSelectedQuality(data.formats[0].url);
			} else if (data.downloadLink) {
				setSelectedQuality(data.downloadLink);
			} else if (data.downloadLinks && data.downloadLinks.length > 0) {
				setSelectedQuality(data.downloadLinks[0].url);
			}
		} catch (err) {
			const msg = "An error occurred while connecting to the server.";
			setError(msg);
			toast({
				title: "Connection Error",
				description: msg,
				variant: "destructive",
			});
			console.error("[Downloader] Error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDownload = (downloadUrl: string) => {
		if (!downloadUrl) return;

		toast({
			title: "Download Started",
			description: "Your video should start downloading in a new tab.",
		});

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
		const linkToCopy = selectedQuality || response?.downloadLink;
		if (linkToCopy) {
			navigator.clipboard.writeText(linkToCopy);
			toast({
				title: "Copied!",
				description: "Download link copied to clipboard.",
			});
		}
	};

	return (
		<div className='w-full max-w-2xl mx-auto'>
			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* URL Input */}
				<div className='relative'>
					<label
						htmlFor='url'
						className='block text-sm font-bold text-foreground mb-3'>
						Paste Video URL
					</label>
					<div className='relative group'>
						<div className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors'>
							<LinkIcon className='h-5 w-5' />
						</div>
						<Input
							id='url'
							type='url'
							placeholder='Paste YouTube, Instagram, Facebook, or TikTok URL here...'
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							className='w-full h-14 pl-12 pr-4 text-base rounded-xl border-2 border-border focus:border-primary focus:ring-primary/20 transition-all shadow-sm'
							disabled={loading}
						/>
					</div>
					<p className='text-xs text-muted-foreground mt-3 flex items-center gap-1.5 px-1'>
						<Zap className='h-3 w-3 text-primary' />
						Supports Reels, Shorts, Posts, and Videos from all major
						platforms.
					</p>
				</div>

				{/* Submit Button */}
				<Button
					type='submit'
					disabled={loading}
					className='w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all'>
					{loading ? (
						<>
							<Loader2 className='mr-2 h-6 w-6 animate-spin' />
							Processing Video...
						</>
					) : (
						<>
							<DownloadIcon className='mr-2 h-6 w-6' />
							Download Now
						</>
					)}
				</Button>

				{/* Error Alert */}
				{error && (
					<Alert
						variant='destructive'
						className='rounded-xl border-2'>
						<AlertCircle className='h-5 w-5' />
						<AlertDescription className='font-medium'>
							{error}
						</AlertDescription>
					</Alert>
				)}

				{/* Success Response */}
				{response?.success && (
					<div className='space-y-6 p-8 bg-muted/30 rounded-2xl border-2 border-border animate-in fade-in zoom-in-95 duration-500'>
						<div className='flex items-center gap-3 text-green-600'>
							<div className='p-1 bg-green-100 rounded-full'>
								<CheckCircle className='h-6 w-6' />
							</div>
							<p className='font-bold text-lg'>
								Ready for download!
							</p>
						</div>

						{response.title && (
							<div className='space-y-1'>
								<p className='text-xs font-bold text-muted-foreground uppercase tracking-wider'>
									Video Title
								</p>
								<p className='text-foreground font-semibold line-clamp-2'>
									{response.title}
								</p>
							</div>
						)}

						{(response.thumbnail ||
							response.downloadLink ||
							selectedQuality) && (
							<div className='space-y-2'>
								<p className='text-xs font-bold text-muted-foreground uppercase tracking-wider'>
									Preview
								</p>
								<div className='relative aspect-video rounded-xl overflow-hidden border-2 border-border shadow-sm bg-background'>
									{response.thumbnail ? (
										<Image
											src={response.thumbnail}
											alt='Video thumbnail'
											fill
											unoptimized
											className='object-cover'
										/>
									) : (
										<video
											src={
												selectedQuality ||
												response.downloadLink
											}
											className='w-full h-full object-cover'
											controls
											muted
											playsInline
										/>
									)}
								</div>
							</div>
						)}

						{/* Quality Selection or Picker Selection */}
						{response.formats?.length ||
						response.downloadLinks?.length ||
						response.picker?.length ? (
							<div className='space-y-3'>
								<label className='block text-xs font-bold text-muted-foreground uppercase tracking-wider'>
									{response.picker?.length
										? "Select Media to Download"
										: "Select Quality"}
								</label>
								<div className='grid gap-2'>
									{(
										response.formats ||
										response.downloadLinks ||
										response.picker ||
										[]
									)
										.slice(0, 3)
										.map(
											(
												item: {
													url: string;
													thumb?: string;
													type?: string;
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
															item.url,
														)
													}
													className={`w-full p-4 text-left rounded-xl border-2 transition-all group ${
														selectedQuality ===
														item.url
															? "border-primary bg-primary/10 shadow-sm"
															: "border-border bg-background hover:border-primary/50"
													}`}>
													<div className='flex items-center justify-between'>
														<div className='flex items-center gap-3'>
															{item.thumb && (
																<div className='h-12 w-12 rounded-lg overflow-hidden border border-border shrink-0 relative'>
																	<Image
																		src={
																			item.thumb
																		}
																		alt=''
																		fill
																		unoptimized
																		className='object-cover'
																	/>
																</div>
															)}
															<div className='space-y-1'>
																<p className='font-bold text-foreground group-hover:text-primary transition-colors'>
																	{item.quality ||
																		(item.type
																			? `Media ${idx + 1} (${item.type})`
																			: `Media ${idx + 1}`)}
																</p>
																{item.size && (
																	<p className='text-xs text-muted-foreground font-medium'>
																		File
																		size:{" "}
																		{
																			item.size
																		}
																	</p>
																)}
															</div>
														</div>
														<div
															className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
																selectedQuality ===
																item.url
																	? "border-primary bg-primary text-primary-foreground"
																	: "border-muted-foreground/30 group-hover:border-primary/50"
															}`}>
															{selectedQuality ===
																item.url && (
																<CheckCircle className='w-4 h-4' />
															)}
														</div>
													</div>
												</button>
											),
										)}
								</div>
							</div>
						) : null}

						{/* Action Buttons */}
						<div className='flex flex-col sm:flex-row gap-3 pt-2'>
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
								className='flex-1 h-14 text-base font-bold rounded-xl shadow-md'>
								<DownloadIcon className='mr-2 h-5 w-5' />
								Download Video
							</Button>
							<Button
								variant='outline'
								onClick={handleCopyUrl}
								disabled={
									!selectedQuality && !response.downloadLink
								}
								className='flex-1 h-14 text-base font-bold rounded-xl border-2'>
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
