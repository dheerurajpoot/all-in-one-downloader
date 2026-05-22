"use client";

export default function TermsPage() {
	return (
		<div className='min-h-screen flex flex-col bg-background'>
			<main className='flex-1 py-20 px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto max-w-4xl'>
					{/* Header */}
					<div className='space-y-6 mb-12'>
						<h1 className='text-4xl sm:text-5xl font-bold text-foreground'>
							Terms of Service
						</h1>
						<p className='text-muted-foreground'>
							Last updated: January 2024
						</p>
					</div>

					<div className='prose prose-invert max-w-none space-y-8'>
						{/* Agreement */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Agreement to Terms
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								By accessing and using DownloadPro, you accept
								and agree to be bound by the terms and provision
								of this agreement. If you do not agree to abide
								by the above, please do not use this service.
							</p>
						</section>

						{/* Use License */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								License
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								Permission is granted to temporarily download
								one copy of the materials (information or
								software) on DownloadPro for personal,
								non-commercial transitory viewing only. This is
								the grant of a license, not a transfer of title,
								and under this license you may not:
							</p>
							<ul className='space-y-2 text-muted-foreground ml-6'>
								<li>• Modifying or copying the materials</li>
								<li>
									• Using the materials for any commercial
									purpose or for any public display
								</li>
								<li>
									• Attempting to decompile or reverse
									engineer any software contained on
									DownloadPro
								</li>
								<li>
									• Removing any copyright or other
									proprietary notations from the materials
								</li>
								<li>
									• Transferring the materials to another
									person or &quot;mirroring&quot; the
									materials on any other server
								</li>
							</ul>
						</section>

						{/* Disclaimer */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Disclaimer
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								The materials on DownloadPro are provided on an
								&apos;as is&apos; basis. DownloadPro makes no
								warranties, expressed or implied, and hereby
								disclaims and negates all other warranties
								including, without limitation, implied
								warranties or conditions of merchantability,
								fitness for a particular purpose, or
								non-infringement of intellectual property or
								other violation of rights.
							</p>
						</section>

						{/* Limitations */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Limitations
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								In no event shall DownloadPro or its suppliers
								be liable for any damages (including, without
								limitation, damages for loss of data or profit,
								or due to business interruption) arising out of
								the use or inability to use the materials on
								DownloadPro, even if DownloadPro or an
								authorized representative has been notified
								orally or in writing of the possibility of such
								damage.
							</p>
						</section>

						{/* Accuracy of Materials */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Accuracy of Materials
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								The materials appearing on DownloadPro could
								include technical, typographical, or
								photographic errors. DownloadPro does not
								warrant that any of the materials on DownloadPro
								are accurate, complete, or current. DownloadPro
								may make changes to the materials contained on
								DownloadPro at any time without notice.
							</p>
						</section>

						{/* Links */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Links
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								DownloadPro has not reviewed all of the sites
								linked to its website and is not responsible for
								the contents of any such linked site. The
								inclusion of any link does not imply endorsement
								by DownloadPro of the site. Use of any such
								linked website is at the user&apos;s own risk.
							</p>
						</section>

						{/* Modifications */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Modifications
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								DownloadPro may revise these terms of service
								for its website at any time without notice. By
								using this website, you are agreeing to be bound
								by the then current version of these terms of
								service.
							</p>
						</section>

						{/* Governing Law */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								Governing Law
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								These terms and conditions are governed by and
								construed in accordance with the laws of the
								United States, and you irrevocably submit to the
								exclusive jurisdiction of the courts in that
								location.
							</p>
						</section>

						{/* User Generated Content */}
						<section className='space-y-4'>
							<h2 className='text-2xl font-bold text-foreground'>
								User Generated Content
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								Users are responsible for ensuring that any
								videos they download comply with local laws and
								the terms of service of the original platform.
								DownloadPro is not liable for any misuse of
								downloaded content.
							</p>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}
