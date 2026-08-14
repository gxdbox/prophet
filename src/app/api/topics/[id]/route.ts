import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  const topic = await prisma.topic.findUnique({
    where: { id: params.id },
    include: { options: { orderBy: { voteCount: "desc" } } },
  });

  if (!topic) {
    return NextResponse.json({ error: "Prophecy not found" }, { status: 404 });
  }

  await prisma.topic.update({ where: { id: params.id }, data: { viewCount: { increment: 1 } } });

  return NextResponse.json({ topic: { ...topic, viewCount: topic.viewCount + 1 } });
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const { title, description, status } = body;

    const topic = await prisma.topic.update({
      where: { id: params.id },
      data: {
        ...(title && { title: String(title).trim() }),
        ...(description && { description: String(description).trim() }),
        ...(status && { status: String(status) }),
      },
      include: { options: true },
    });

    return NextResponse.json({ topic });
  } catch {
    return NextResponse.json({ error: "Failed to update prophecy" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.topic.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete prophecy" }, { status: 500 });
  }
}
