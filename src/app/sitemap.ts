import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = "https://prophet.lifelong-growth.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const topics = await prisma.topic.findMany({ select: { id: true, updatedAt: true } });

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/create`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...topics.map((t) => ({
      url: `${SITE_URL}/topic/${t.id}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
