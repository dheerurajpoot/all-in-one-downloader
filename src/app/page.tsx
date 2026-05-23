"use client";

import {
	ArrowRight,
	Zap,
	Shield,
	Clock,
	CheckCircle2,
	Download,
	Globe,
	Smartphone,
	Settings,
	HelpCircle,
} from "lucide-react";
import { DownloaderForm } from "../components/downloader-form";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../components/ui/accordion";

export default function Page() {
	return (
		<div className='min-h-screen flex flex-col bg-background'>
			{/* Hero & Downloader Section */}
			<section className='relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden'>
				<div className='absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none' />

				<div className='relative mx-auto max-w-7xl'>
					<div className='text-center mb-12 space-y-6'>
						<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-in fade-in slide-in-from-top-4 duration-1000'>
							<span className='text-sm font-semibold text-primary'>
								✨ The Ultimate Video Downloader
							</span>
						</div>

						<h1 className='text-balance text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-tight'>
							Download High-Quality Videos{" "}
							<br className='hidden sm:block' />
							<span className='text-primary'>
								Instantly & Securely
							</span>
						</h1>

						<p className='text-balance text-lg text-muted-foreground max-w-2xl mx-auto'>
							Paste any video link from YouTube, Instagram,
							Facebook, or TikTok. Our system automatically
							detects the platform and provides high-quality
							download options.
						</p>
					</div>

					{/* Main Downloader Form - TOP PRIORITY */}
					<div
						id='downloader'
						className='max-w-3xl mx-auto mb-20 animate-in fade-in zoom-in-95 duration-700 delay-200'>
						<div className='bg-card rounded-2xl border border-border p-6 sm:p-10 shadow-xl shadow-primary/5 ring-1 ring-primary/10'>
							<DownloaderForm />
						</div>
						<p className='text-center mt-4 text-sm text-muted-foreground'>
							By using our service, you agree to our{" "}
							<a
								href='/terms'
								className='text-primary hover:underline'>
								Terms of Service
							</a>
							.
						</p>
					</div>

					{/* Quick Features */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto'>
						{[
							{
								icon: Zap,
								label: "Lightning Fast",
								desc: "Fast processing",
							},
							{
								icon: Shield,
								label: "Secure",
								desc: "Privacy protected",
							},
							{
								icon: Globe,
								label: "Universal",
								desc: "Multi-platform",
							},
							{
								icon: Smartphone,
								label: "Mobile Ready",
								desc: "Use on any device",
							},
						].map((feature, i) => (
							<div
								key={i}
								className='p-4 rounded-xl border border-border bg-card/50 text-center space-y-2'>
								<feature.icon className='h-6 w-6 text-primary mx-auto' />
								<h3 className='font-bold text-sm'>
									{feature.label}
								</h3>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Supported Platforms Section */}
			<section className='py-20 bg-muted/30 border-y border-border'>
				<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16 space-y-4'>
						<h2 className='text-3xl font-bold tracking-tight'>
							Supported Platforms
						</h2>
						<p className='text-muted-foreground'>
							We support all major social media platforms
						</p>
					</div>

					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8'>
						{[
							{ name: "YouTube", color: "text-red-600" },
							{ name: "Instagram", color: "text-pink-600" },
							{ name: "Facebook", color: "text-blue-600" },
							{
								name: "Twitter / X",
								color: "text-slate-900 dark:text-white",
							},
							{
								name: "TikTok",
								color: "text-black dark:text-white",
							},
							{ name: "Vimeo", color: "text-blue-400" },
						].map((platform, i) => (
							<div
								key={i}
								className='flex flex-col items-center gap-3 p-4 grayscale hover:grayscale-0 transition-all duration-300'>
								<div className='h-12 w-12 rounded-full bg-background border border-border flex items-center justify-center shadow-sm'>
									<span
										className={`text-xl font-bold ${platform.color}`}>
										{platform.name[0]}
									</span>
								</div>
								<span className='font-medium text-sm'>
									{platform.name}
								</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className='py-24 px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto max-w-7xl'>
					<div className='text-center mb-20'>
						<h2 className='text-3xl sm:text-4xl font-bold text-foreground'>
							How to Download Videos?
						</h2>
						<p className='mt-4 text-muted-foreground'>
							Simple 3-step process to get your videos
						</p>
					</div>

					<div className='grid md:grid-cols-3 gap-12 relative'>
						<div className='hidden md:block absolute top-12 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-border to-transparent -z-10' />

						{[
							{
								step: 1,
								title: "Copy Video Link",
								desc: "Copy the URL of the video you want to download from any social platform.",
							},
							{
								step: 2,
								title: "Paste into Downloader",
								desc: "Paste the link into the smart search bar above. No platform selection needed!",
							},
							{
								step: 3,
								title: "Get Your Video",
								desc: "Our system detects the link and gives you the best quality download options.",
							},
						].map((item, i) => (
							<div
								key={i}
								className='relative flex flex-col items-center text-center group'>
								<div className='h-16 w-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20'>
									{item.step}
								</div>
								<h3 className='text-xl font-bold mb-3'>
									{item.title}
								</h3>
								<p className='text-muted-foreground'>
									{item.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Why Choose Us Section */}
			<section className='py-24 bg-card border-y border-border'>
				<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
					<div className='grid lg:grid-cols-2 gap-16 items-center'>
						<div className='space-y-8'>
							<h2 className='text-3xl sm:text-4xl font-bold tracking-tight'>
								Why All-In-One Downloader is the{" "}
								<span className='text-primary'>
									Best Choice
								</span>
							</h2>
							<p className='text-lg text-muted-foreground'>
								Our tool is built with speed and security in
								mind. We provide a seamless experience for users
								who want to save content for offline viewing.
							</p>

							<div className='space-y-4'>
								{[
									"Unlimited downloads with no hidden costs",
									"Supports HD, 4K, and 8K resolutions",
									"Works on Windows, macOS, Android, and iOS",
									"No software installation or browser extensions required",
									"Completely free of annoying pop-up ads",
								].map((text, i) => (
									<div
										key={i}
										className='flex items-center gap-3'>
										<CheckCircle2 className='h-5 w-5 text-primary shrink-0' />
										<span className='font-medium'>
											{text}
										</span>
									</div>
								))}
							</div>
						</div>

						<div className='grid sm:grid-cols-2 gap-6'>
							{[
								{
									icon: Settings,
									title: "Custom Quality",
									desc: "Choose exactly the resolution and format you need.",
								},
								{
									icon: Clock,
									title: "Saves Time",
									desc: "Fast processing ensures you don't wait around.",
								},
								{
									icon: Shield,
									title: "Privacy First",
									desc: "We don't track your downloads or store video data.",
								},
								{
									icon: Download,
									title: "Batch Ready",
									desc: "Optimized for downloading multiple videos.",
								},
							].map((feature, i) => (
								<div
									key={i}
									className='p-6 rounded-2xl border border-border bg-background hover:border-primary/50 transition-colors shadow-sm'>
									<feature.icon className='h-10 w-10 text-primary mb-4' />
									<h3 className='font-bold mb-2'>
										{feature.title}
									</h3>
									<p className='text-sm text-muted-foreground'>
										{feature.desc}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className='py-24 px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto max-w-3xl'>
					<div className='text-center mb-16 space-y-4'>
						<div className='inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2'>
							<HelpCircle className='h-6 w-6' />
						</div>
						<h2 className='text-3xl font-bold'>
							Frequently Asked Questions
						</h2>
						<p className='text-muted-foreground'>
							Everything you need to know about our downloader
						</p>
					</div>

					<Accordion type='single' collapsible className='w-full'>
						{[
							{
								q: "Is All-In-One Downloader free to use?",
								a: "Yes, our service is completely free to use. There are no hidden fees, subscriptions, or limits on the number of videos you can download.",
							},
							{
								q: "Which platforms are supported?",
								a: "We currently support YouTube, Instagram, Facebook, and several other popular video-sharing platforms. We are constantly adding support for more websites.",
							},
							{
								q: "Do I need to install any software?",
								a: "No installation is required. Our downloader is a web-based tool that works directly in your browser on any device (PC, Mac, iPhone, or Android).",
							},
							{
								q: "What is the maximum video quality available?",
								a: "The quality depends on the original video. If the source video is available in 1080p, 4K, or 8K, our downloader will provide options for those resolutions.",
							},
							{
								q: "Is it legal to download videos?",
								a: "Downloading videos for personal offline viewing is generally considered acceptable, but you should always respect copyright laws and the terms of service of the original platform. Do not redistribute copyrighted content without permission.",
							},
						].map((item, i) => (
							<AccordionItem
								key={i}
								value={`item-${i}`}
								className='border-border px-4 hover:bg-muted/50 transition-colors rounded-xl mb-4 border'>
								<AccordionTrigger className='text-left font-bold py-5 hover:no-underline'>
									{item.q}
								</AccordionTrigger>
								<AccordionContent className='text-muted-foreground pb-5 leading-relaxed'>
									{item.a}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</section>

			{/* CTA Section */}
			<section className='py-20 px-4'>
				<div className='mx-auto max-w-5xl rounded-3xl bg-primary p-12 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/40'>
					<div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]' />
					<h2 className='text-3xl sm:text-4xl font-bold mb-6 relative z-10'>
						Ready to save your favorite videos?
					</h2>
					<p className='text-primary-foreground/80 mb-10 text-lg max-w-2xl mx-auto relative z-10'>
						Start using the fastest and most reliable video
						downloader on the web today.
					</p>
					<button
						onClick={() =>
							window.scrollTo({ top: 0, behavior: "smooth" })
						}
						className='inline-flex items-center gap-2 px-8 py-4 bg-background text-primary rounded-xl font-bold hover:scale-105 transition-all shadow-lg relative z-10'>
						Try It Now <ArrowRight className='h-5 w-5' />
					</button>
				</div>
			</section>
		</div>
	);
}
