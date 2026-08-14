import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TopicDetailClient } from "./TopicDetailClient";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = await prisma.topic.findUnique({
    where: { id: params.id },
    include: { options: true },
  });

  if (!topic) {
    return { title: "Prophecy Not Found" };
  }

  return {
    title: topic.title,
    description: topic.description,
    openGraph: {
      title: topic.title,
      description: topic.description,
      url: `https://evolutionary-prophecy.com/topic/${topic.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: topic.title,
      description: topic.description,
    },
  };
}

export default async function TopicDetailPage({ params }: Props) {
  const topic = await prisma.topic.findUnique({
    where: { id: params.id },
    include: { options: { orderBy: { voteCount: "desc" } } },
  });

  if (!topic) notFound();

  await prisma.topic.update({ where: { id: params.id }, data: { viewCount: { increment: 1 } } });

  return <TopicDetailClient topic={topic} />;
}
