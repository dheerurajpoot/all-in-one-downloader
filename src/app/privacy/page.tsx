"use client";

export default function PrivacyPage() {
	return (
		<div className='min-h-screen flex flex-col bg-background'>
			<main className='flex-1 py-20 px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto max-w-4xl'>
					{/* Header */}
					<div className='space-y-6 mb-12'>
						<h1 className='text-4xl sm:text-5xl font-bold text-foreground'>
							Privacy Policy
						</h1>
						<p className='text-muted-foreground'>
							Last updated: January 2024
						</p>
					</div>

					<div className='space-y-8'>
						{/* Introduction */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Introduction
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								DownloadPro (&quot;we&quot; or &quot;us&quot; or
								&quot;our&quot;) operates the DownloadPro
								website. This page informs you of our policies
								regarding the collection, use, and disclosure of
								personal data when you use our service and the
								choices you have associated with that data.
							</p>
						</section>

						{/* Information Collection */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Information Collection
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								We collect very minimal information when you use
								DownloadPro. Specifically:
							</p>
							<ul className='space-y-2 text-muted-foreground ml-6'>
								<li>
									•{" "}
									<strong>No personal data required:</strong>{" "}
									We do not require you to provide personal
									information such as name, email, or phone
									number
								</li>
								<li>
									• <strong>No account creation:</strong>{" "}
									DownloadPro can be used entirely without
									registration
								</li>
								<li>
									• <strong>No video history:</strong> We do
									not store information about the videos you
									download
								</li>
								<li>
									• <strong>Automatic data:</strong> We may
									collect basic technical information such as
									IP address and browser type for security
									purposes
								</li>
							</ul>
						</section>

						{/* Data Usage */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								How We Use Your Data
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								We use collected data for the following
								purposes:
							</p>
							<ul className='space-y-2 text-muted-foreground ml-6'>
								<li>• To provide and maintain our service</li>
								<li>
									• To notify you about changes to our service
								</li>
								<li>
									• To allow you to participate in interactive
									features
								</li>
								<li>• To provide customer support</li>
								<li>
									• To gather analysis or valuable information
									to improve our service
								</li>
								<li>• To monitor the usage of our service</li>
								<li>
									• To detect, prevent and address technical
									issues
								</li>
							</ul>
						</section>

						{/* Data Security */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Data Security
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								The security of your data is important to us but
								remember that no method of transmission over the
								Internet is 100% secure. While we strive to use
								commercially acceptable means to protect your
								personal information, we cannot guarantee its
								absolute security.
							</p>
						</section>

						{/* Cookies */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Cookies
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								DownloadPro uses cookies to enhance your
								experience. These are small files stored on your
								device that help us remember your preferences
								and improve our service. You can control cookies
								through your browser settings.
							</p>
						</section>

						{/* Third Party Services */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Third Party Services
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								Our service may contain links to third-party
								websites and services that are not operated by
								us. This Privacy Policy does not apply to
								third-party websites and services, and we are
								not responsible for their privacy practices. We
								encourage you to review the privacy policies of
								any third-party service before providing your
								information.
							</p>
						</section>

						{/* Children's Privacy */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Children&apos;s Privacy
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								Our service does not address anyone under the
								age of 13. We do not knowingly collect
								personally identifiable information from
								children under 13. If we become aware that a
								child under 13 has provided us with personal
								information, we take steps to remove such
								information.
							</p>
						</section>

						{/* Policy Changes */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Changes to This Privacy Policy
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								We may update our Privacy Policy from time to
								time. We will notify you of any changes by
								posting the new Privacy Policy on this page and
								updating the &quot;effective date&quot; at the
								top of this Privacy Policy.
							</p>
						</section>

						{/* Contact */}
						<section className='space-y-4 p-6 bg-card rounded-lg border border-border'>
							<h2 className='text-2xl font-bold text-foreground'>
								Contact Us
							</h2>
							<p className='text-muted-foreground'>
								If you have any questions about this Privacy
								Policy, please contact us at:
							</p>
							<p className='text-muted-foreground'>
								<strong>Email:</strong>{" "}
								<a
									href='mailto:privacy@downloadpro.com'
									className='text-primary hover:underline'>
									privacy@downloadpro.com
								</a>
							</p>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}
