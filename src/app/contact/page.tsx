"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Simulate form submission
		setTimeout(() => {
			setSubmitted(true);
			setFormData({ name: "", email: "", subject: "", message: "" });
			setLoading(false);

			// Reset success message after 5 seconds
			setTimeout(() => setSubmitted(false), 5000);
		}, 1000);
	};

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
											href='mailto:support@downloadpro.com'
											className='text-muted-foreground hover:text-primary transition-colors'>
											support@downloadpro.com
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
											href='tel:+1234567890'
											className='text-muted-foreground hover:text-primary transition-colors'>
											+1 (234) 567-890
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
											San Francisco, CA
											<br />
											United States
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

						{/* Contact Form */}
						<div>
							<form onSubmit={handleSubmit} className='space-y-4'>
								<div>
									<label
										htmlFor='name'
										className='block text-sm font-semibold text-foreground mb-2'>
										Full Name
									</label>
									<Input
										id='name'
										name='name'
										type='text'
										placeholder='John Doe'
										value={formData.name}
										onChange={handleChange}
										required
									/>
								</div>

								<div>
									<label
										htmlFor='email'
										className='block text-sm font-semibold text-foreground mb-2'>
										Email Address
									</label>
									<Input
										id='email'
										name='email'
										type='email'
										placeholder='john@example.com'
										value={formData.email}
										onChange={handleChange}
										required
									/>
								</div>

								<div>
									<label
										htmlFor='subject'
										className='block text-sm font-semibold text-foreground mb-2'>
										Subject
									</label>
									<Input
										id='subject'
										name='subject'
										type='text'
										placeholder='How can we help?'
										value={formData.subject}
										onChange={handleChange}
										required
									/>
								</div>

								<div>
									<label
										htmlFor='message'
										className='block text-sm font-semibold text-foreground mb-2'>
										Message
									</label>
									<textarea
										id='message'
										name='message'
										placeholder='Your message here...'
										rows={6}
										value={formData.message}
										onChange={handleChange}
										required
										className='w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
									/>
								</div>

								{submitted && (
									<Alert className='bg-green-50 border-green-200'>
										<AlertDescription className='text-green-800'>
											Thank you for your message!
											We&apos;ll get back to you soon.
										</AlertDescription>
									</Alert>
								)}

								<Button
									type='submit'
									disabled={loading}
									className='w-full'>
									{loading ? (
										"Sending..."
									) : (
										<>
											<Send className='mr-2 h-5 w-5' />
											Send Message
										</>
									)}
								</Button>
							</form>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
