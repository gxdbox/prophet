import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

const VOTE_COOKIE = "evp_votes";

function parseVotes(cookie: string | undefined) {
  if (!cookie) return {};
  try {
    return JSON.parse(decodeURIComponent(cookie)) as Record<string, string | null>;
  } catch {
    return {};
  }
}

function serializeVotes(votes: Record<string, string | null>) {
  return encodeURIComponent(JSON.stringify(votes));
}

function setVoteCookie(response: NextResponse, votes: Record<string, string | null>) {
  response.cookies.set(VOTE_COOKIE, serializeVotes(votes), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false,
  });
  return response;
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { optionId } = await request.json();
    if (!optionId || typeof optionId !== "string") {
      return NextResponse.json({ error: "optionId required" }, { status: 400 });
    }

    const option = await prisma.option.findFirst({
      where: { id: optionId, topicId: params.id },
    });
    if (!option) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const cookieHeader = request.headers.get("cookie") ?? undefined;
    const votes = parseVotes(cookieHeader);
    const previousOptionId = votes[params.id];

    // Cancel existing vote on the same branch
    if (previousOptionId === optionId) {
      votes[params.id] = null;
      const [updatedOption, updatedTopic] = await prisma.$transaction([
        prisma.option.update({
          where: { id: optionId },
          data: { voteCount: { decrement: 1 } },
        }),
        prisma.topic.update({
          where: { id: params.id },
          data: { voteCount: { decrement: 1 } },
        }),
      ]);

      return setVoteCookie(
        NextResponse.json({ topic: updatedTopic, option: updatedOption, voted: null }),
        votes
      );
    }

    // Switch vote from one branch to another
    if (previousOptionId) {
      const [updatedPrevious, updatedCurrent] = await prisma.$transaction([
        prisma.option.update({
          where: { id: previousOptionId },
          data: { voteCount: { decrement: 1 } },
        }),
        prisma.option.update({
          where: { id: optionId },
          data: { voteCount: { increment: 1 } },
        }),
      ]);

      votes[params.id] = optionId;
      const topic = await prisma.topic.findUnique({ where: { id: params.id } });

      return setVoteCookie(
        NextResponse.json({
          topic,
          option: updatedCurrent,
          previousOption: updatedPrevious,
          voted: optionId,
        }),
        votes
      );
    }

    // New vote
    votes[params.id] = optionId;
    const [updatedOption, updatedTopic] = await prisma.$transaction([
      prisma.option.update({
        where: { id: optionId },
        data: { voteCount: { increment: 1 } },
      }),
      prisma.topic.update({
        where: { id: params.id },
        data: { voteCount: { increment: 1 } },
      }),
    ]);

    return setVoteCookie(
      NextResponse.json({ topic: updatedTopic, option: updatedOption, voted: optionId }),
      votes
    );
  } catch (err) {
    console.error("POST /api/topics/[id]/vote error:", err);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
