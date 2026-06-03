"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { SITE_EMAIL, SITE_PHONE } from "@/lib/constant";

export default function ContactPage() {
	return (
		<div className='min-h-screen flex flex-col bg-background'>
			<main className='flex-1 py-20 px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto max-w-4xl'>
					{/* Header */}
					<div className='space-y-6 mb-16 text-center'>
						<h1 className='text-4xl sm:text-5xl font-bold text-foreground'>
							Get in Touch
						</h1>
						<p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
							Have a question or feedback? We&apos;d love to hear
							from you. Send us a message and we&apos;ll respond
							as soon as possible.
						</p>
					</div>

					<div className='grid md:grid-cols-2 gap-12'>
						{/* Contact Information */}
						<div className='space-y-8'>
							<div className='space-y-8'>
								<div className='flex gap-4'>
									<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0'>
										<Mail className='h-6 w-6 text-primary' />
									</div>
									<div>
										<h3 className='font-semibold text-foreground mb-1'>
											Email
										</h3>
										<a
											href={`mailto:${SITE_EMAIL}`}
											className='text-muted-foreground hover:text-primary transition-colors'>
											{SITE_EMAIL}
										</a>
									</div>
								</div>

								<div className='flex gap-4'>
									<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0'>
										<Phone className='h-6 w-6 text-primary' />
									</div>
									<div>
										<h3 className='font-semibold text-foreground mb-1'>
											Phone
										</h3>
										<a
											href={`tel:${SITE_PHONE}`}
											className='text-muted-foreground hover:text-primary transition-colors'>
											{SITE_PHONE}
										</a>
									</div>
								</div>

								<div className='flex gap-4'>
									<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0'>
										<MapPin className='h-6 w-6 text-primary' />
									</div>
									<div>
										<h3 className='font-semibold text-foreground mb-1'>
											Location
										</h3>
										<p className='text-muted-foreground'>
											Delhi
											<br />
											India
										</p>
									</div>
								</div>
							</div>

							{/* Response Time */}
							<div className='p-6 bg-card rounded-lg border border-border'>
								<h3 className='font-semibold text-foreground mb-2'>
									Response Time
								</h3>
								<p className='text-muted-foreground text-sm'>
									We typically respond to all inquiries within
									24 hours during business days.
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
