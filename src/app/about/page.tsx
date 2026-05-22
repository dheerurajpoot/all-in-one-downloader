"use client";

import { CheckCircle } from "lucide-react";

export default function AboutPage() {
	return (
		<div className='min-h-screen flex flex-col bg-background'>
			<main className='flex-1 py-20 px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto max-w-4xl'>
					{/* Header */}
					<div className='space-y-6 mb-16'>
						<h1 className='text-4xl sm:text-5xl font-bold text-foreground'>
							About DownloadPro
						</h1>
						<p className='text-xl text-muted-foreground'>
							Your trusted solution for downloading videos from
							the web.
						</p>
					</div>

					{/* Mission Section */}
					<div className='space-y-12'>
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Our Mission
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								DownloadPro is dedicated to providing a simple,
								fast, and secure way to download videos from
								your favorite social media platforms. We
								understand that sometimes you want to save
								videos for offline viewing, sharing with
								friends, or archiving important content. Our
								mission is to make this process as
								straightforward as possible.
							</p>
						</section>

						{/* Why Choose Us */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Why Choose Us?
							</h2>
							<div className='space-y-3'>
								{[
									"Lightning-fast download speeds with advanced optimization",
									"100% secure and private - we never store your data",
									"Support for multiple platforms in one tool",
									"Multiple quality options to choose from",
									"No registration or account required",
									"Works on desktop and mobile devices",
									"Free to use with no hidden costs",
									"Regular updates with new features",
								].map((item, idx) => (
									<div
										key={idx}
										className='flex items-start gap-3'>
										<CheckCircle className='h-6 w-6 text-primary flex-shrink-0 mt-0.5' />
										<p className='text-muted-foreground'>
											{item}
										</p>
									</div>
								))}
							</div>
						</section>

						{/* Technology */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Our Technology
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								We use state-of-the-art APIs and modern web
								technologies to ensure that your videos are
								downloaded quickly and reliably. Our system is
								built on a robust infrastructure that handles
								millions of downloads every month. We
								continuously invest in improving our service to
								provide the best possible experience.
							</p>
						</section>

						{/* Privacy & Security */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Privacy & Security
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								Your privacy is our top priority. We do not
								collect, store, or share any personal
								information. Each download is processed securely
								and immediately discarded from our servers. We
								never track your browsing history or the videos
								you download. You can use DownloadPro with
								complete peace of mind.
							</p>
						</section>

						{/* Contact */}
						<section className='space-y-4 p-8 bg-card rounded-lg border border-border'>
							<h2 className='text-2xl font-bold text-foreground'>
								Get in Touch
							</h2>
							<p className='text-muted-foreground'>
								Have questions or feedback? We&apos;d love to
								hear from you! Contact our support team at{" "}
								<a
									href='mailto:support@downloadpro.com'
									className='text-primary hover:underline'>
									support@downloadpro.com
								</a>
							</p>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}
