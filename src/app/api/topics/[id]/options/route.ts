import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { content, description } = await request.json();
    if (!content || typeof content !== "string" || content.trim().length === 0 || content.trim().length > 80) {
      return NextResponse.json({ error: "Branch content must be 1-80 characters" }, { status: 400 });
    }

    const topic = await prisma.topic.findUnique({ where: { id: params.id } });
    if (!topic) {
      return NextResponse.json({ error: "Prophecy not found" }, { status: 404 });
    }

    const option = await prisma.option.create({
      data: {
        content: content.trim(),
        description: description?.trim() || undefined,
        topicId: params.id,
      },
    });

    return NextResponse.json({ option }, { status: 201 });
  } catch (err) {
    console.error("POST /api/topics/[id]/options error:", err);
    return NextResponse.json({ error: "Failed to add branch" }, { status: 500 });
  }
}
