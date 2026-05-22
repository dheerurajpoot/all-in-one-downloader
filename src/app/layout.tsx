import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
	title: "DownloadPro - Download YouTube, Instagram & Facebook Videos",
	description:
		"Fast and easy video downloader for YouTube, Instagram reels, shorts, and Facebook videos. Download high-quality videos instantly.",
	generator: "v0.app",
	keywords: [
		"video downloader",
		"youtube downloader",
		"instagram downloader",
		"facebook downloader",
		"reels downloader",
	],
	openGraph: {
		title: "All-In-One Downloader - Universal Video Downloader",
		description:
			"Download videos from YouTube, Instagram, and Facebook with multiple quality options.",
		type: "website",
	},
	icons: {
		icon: [
			{
				url: "/icon-light-32x32.png",
				media: "(prefers-color-scheme: light)",
			},
			{
				url: "/icon-dark-32x32.png",
				media: "(prefers-color-scheme: dark)",
			},
			{
				url: "/icon.svg",
				type: "image/svg+xml",
			},
		],
		apple: "/apple-icon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className={`${plusJakartaSans.variable} bg-background`}>
			<body className='font-sans antialiased'>
				<Navbar />
				{children}
				<Footer />
				{process.env.NODE_ENV === "production" && <Analytics />}
			</body>
		</html>
	);
}
