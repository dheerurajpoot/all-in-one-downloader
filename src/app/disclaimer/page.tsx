"use client";

import { AlertCircle } from "lucide-react";

export default function DisclaimerPage() {
	return (
		<div className='min-h-screen flex flex-col bg-background'>
			<main className='flex-1 py-20 px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto max-w-4xl'>
					{/* Header */}
					<div className='space-y-6 mb-12'>
						<h1 className='text-4xl sm:text-5xl font-bold text-foreground'>
							Disclaimer
						</h1>
						<p className='text-muted-foreground'>
							Last updated: January 2024
						</p>
					</div>

					{/* Important Notice */}
					<div className='mb-12 p-6 bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg'>
						<div className='flex gap-4'>
							<AlertCircle className='h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5' />
							<div>
								<h3 className='font-semibold text-yellow-900 dark:text-yellow-100 mb-2'>
									Important Legal Notice
								</h3>
								<p className='text-yellow-800 dark:text-yellow-200 text-sm'>
									Please read this disclaimer carefully before
									using DownloadPro. By accessing and using
									this service, you acknowledge that you have
									read, understood, and agree to be bound by
									all the terms outlined below.
								</p>
							</div>
						</div>
					</div>

					<div className='space-y-8'>
						{/* Use at Your Own Risk */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Use at Your Own Risk
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								DownloadPro is provided &quot;as is&quot; and
								&quot;as available&quot; without any
								representations or warranties, express or
								implied. We make no warranty as to the
								reliability, accuracy, completeness, or
								timeliness of information available through the
								service. Your use of DownloadPro is entirely at
								your own risk.
							</p>
						</section>

						{/* No Liability */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Limitation of Liability
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								In no event shall DownloadPro, its creators,
								owners, or contributors be liable for any
								direct, indirect, incidental, special,
								consequential, or punitive damages arising out
								of or relating to your use of or inability to
								use the service, even if we have been advised of
								the possibility of such damages.
							</p>
						</section>

						{/* Copyright and Intellectual Property */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Copyright & Intellectual Property
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								DownloadPro respects intellectual property
								rights. Users are solely responsible for
								ensuring they have the legal right to download
								any video from a given platform. Video content
								downloaded through our service remains the
								property of the original creator or copyright
								holder. Unauthorized reproduction, distribution,
								or use of copyrighted material is prohibited.
							</p>
						</section>

						{/* Platform Terms */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Third Party Platform Terms
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								By using DownloadPro to download videos, you
								acknowledge that you are subject to the terms of
								service and policies of the original platform
								(YouTube, Instagram, Facebook, etc.).
								DownloadPro is not affiliated with, endorsed by,
								or associated with these platforms. Users must
								comply with all applicable laws and the terms of
								service of these platforms.
							</p>
						</section>

						{/* Legal Compliance */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Legal Compliance
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								Users of DownloadPro are responsible for
								ensuring their use of the service complies with
								all applicable local, state, national, and
								international laws and regulations. DownloadPro
								is not responsible for any illegal use of the
								service or illegal downloads. We do not condone
								copyright infringement or any other illegal
								activity.
							</p>
						</section>

						{/* No Endorsement */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								No Endorsement
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								DownloadPro does not endorse, approve, or
								sponsor any video content, channel, or creator
								whose content is downloaded through our service.
								The existence of any link to a video or external
								content does not constitute endorsement of that
								content.
							</p>
						</section>

						{/* Service Interruption */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Service Interruption
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								DownloadPro does not guarantee uninterrupted or
								error-free service. We reserve the right to
								modify, suspend, or discontinue the service at
								any time without notice. We are not responsible
								for any service interruptions, data loss, or
								other issues that may occur.
							</p>
						</section>

						{/* Changes to Disclaimer */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Changes to This Disclaimer
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								DownloadPro reserves the right to modify this
								disclaimer at any time. Changes will become
								effective immediately upon posting to the
								website. Your continued use of DownloadPro
								following the posting of revised disclaimer
								terms means that you accept and agree to the
								changes.
							</p>
						</section>

						{/* User Conduct */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								User Conduct
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								You agree not to use DownloadPro for any purpose
								that is unlawful or prohibited by these terms.
								You specifically agree not to access or search
								the DownloadPro using any engine, software,
								tool, agent, or other device or mechanism
								(including spiders, robots, crawlers, or data
								mining tools) other than the publicly supported
								interfaces provided by DownloadPro.
							</p>
						</section>

						{/* Severability */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Severability
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								If any part of this disclaimer is found to be
								invalid or unenforceable by a court of competent
								jurisdiction, the remaining portions of this
								disclaimer will remain in effect, and the
								invalid portion will be reformed to the minimum
								extent necessary to make it valid and
								enforceable.
							</p>
						</section>

						{/* Entire Agreement */}
						<section className='space-y-4 p-6 bg-card rounded-lg border border-border'>
							<h2 className='text-2xl font-bold text-foreground'>
								Entire Agreement
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								This disclaimer, together with our Terms of
								Service and Privacy Policy, constitutes the
								entire agreement between you and DownloadPro
								regarding your use of the service. If you have
								questions about this disclaimer, please contact
								us at
								<a
									href='mailto:legal@downloadpro.com'
									className='text-primary hover:underline ml-1'>
									legal@downloadpro.com
								</a>
							</p>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}
