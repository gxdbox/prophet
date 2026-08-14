import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10)));
  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "latest";

  const where =
    category !== "all" && CATEGORIES.some((c) => c.key === category)
      ? { category }
      : {};

  const orderBy =
    sort === "popular"
      ? { voteCount: "desc" as const }
      : sort === "views"
        ? { viewCount: "desc" as const }
        : { createdAt: "desc" as const };

  const [topics, total] = await Promise.all([
    prisma.topic.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { options: { orderBy: { voteCount: "desc" } } },
    }),
    prisma.topic.count({ where }),
  ]);

  return NextResponse.json({ topics, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, options } = body;

    if (!title || typeof title !== "string" || title.trim().length < 5 || title.trim().length > 120) {
      return NextResponse.json({ error: "Title must be 5-120 characters" }, { status: 400 });
    }
    if (!description || typeof description !== "string" || description.trim().length < 10 || description.trim().length > 500) {
      return NextResponse.json({ error: "Description must be 10-500 characters" }, { status: 400 });
    }
    if (!CATEGORIES.some((c) => c.key === category && c.key !== "all")) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    if (!Array.isArray(options) || options.length < 2 || options.length > 8) {
      return NextResponse.json({ error: "Provide 2-8 branches" }, { status: 400 });
    }

    const cleanedOptions = options
      .map((o: { content?: string; description?: string }) => ({
        content: String(o.content ?? "").trim(),
        description: String(o.description ?? "").trim() || undefined,
      }))
      .filter((o) => o.content.length > 0 && o.content.length <= 80);

    if (cleanedOptions.length < 2) {
      return NextResponse.json({ error: "At least 2 valid branches required" }, { status: 400 });
    }

    const topic = await prisma.topic.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        options: { create: cleanedOptions },
      },
      include: { options: true },
    });

    return NextResponse.json({ topic }, { status: 201 });
  } catch (err) {
    console.error("POST /api/topics error:", err);
    return NextResponse.json({ error: "Failed to create prophecy" }, { status: 500 });
  }
}
