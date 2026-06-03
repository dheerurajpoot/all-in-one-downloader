import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import {
	SITE_TITLE,
	SITE_DESCRIPTION,
	SITE_AUTHOR,
	SITE_NAME,
} from "@/lib/constant";
import Script from "next/script";

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
	title: SITE_TITLE,
	description: SITE_DESCRIPTION,
	keywords: [
		"video downloader",
		"youtube downloader",
		"instagram downloader",
		"facebook downloader",
		"reels downloader",
	],
	authors: [{ name: `${SITE_NAME} Team` }],
	creator: SITE_AUTHOR,
	publisher: SITE_AUTHOR,
	robots: "index, follow",
	openGraph: {
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		type: "website",
	},
};

const analyticsScript = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_path: window.location.pathname,
  });
`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className={`${plusJakartaSans.variable} bg-background`}>
			<head suppressHydrationWarning>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, maximum-scale=5'
				/>
				<meta name='theme-color' content='#3b82f6' />
				{/* Google Analytics */}
				<Script
					strategy='afterInteractive'
					src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`} // Replace with your Google Analytics ID
				/>
				<Script
					id='google-analytics'
					strategy='afterInteractive'
					dangerouslySetInnerHTML={{
						__html: analyticsScript,
					}}
				/>
				{/* Google Search Console */}
				<meta
					name='google-site-verification'
					content='YOUR-VERIFICATION-CODE-HERE'
				/>
				{/* AdSense */}
				<Script
					strategy='afterInteractive'
					src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXXX' // Replace with your AdSense ID
					crossOrigin='anonymous'
				/>
			</head>
			<body className='font-sans antialiased'>
				<Navbar />
				{children}
				<Footer />
				{process.env.NODE_ENV === "production" && <Analytics />}
			</body>
		</html>
	);
}
