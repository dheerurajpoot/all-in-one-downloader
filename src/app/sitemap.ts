import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constant";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = SITE_URL;

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/disclaimer`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.8,
		},
	];
}
