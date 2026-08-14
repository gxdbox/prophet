import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, message, page } = await request.json();

    if (!message || typeof message !== "string" || message.trim().length < 5 || message.trim().length > 2000) {
      return NextResponse.json({ error: "Message must be 5-2000 characters" }, { status: 400 });
    }

    await prisma.contact.create({
      data: {
        email: email?.trim() || null,
        message: message.trim(),
        page: page?.trim() || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
