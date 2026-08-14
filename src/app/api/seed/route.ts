import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    await prisma.contact.deleteMany();
    await prisma.option.deleteMany();
    await prisma.topic.deleteMany();

    const topics = [
      {
        title: "How will AI reshape work by 2030?",
        description: "From automation to augmentation, explore the evolutionary branches of human labor in the age of intelligent machines.",
        category: "technology",
        options: [
          { content: "Human-AI collaboration", description: "AI augments most knowledge work" },
          { content: "Mass displacement", description: "Automation replaces routine jobs" },
          { content: "New creative roles", description: "Novel professions emerge" },
          { content: "Universal basic income", description: "Policy adapts to jobless growth" },
          { content: "Hybrid skill economy", description: "Humans specialize where AI is weak" },
        ],
      },
      {
        title: "What is the next step in human evolution?",
        description: "Biology, technology, and culture converge. Which adaptation will define our species' future?",
        category: "biology",
        options: [
          { content: "Genetic self-editing", description: "CRISPR becomes commonplace" },
          { content: "Brain-computer interfaces", description: "Neural implants expand cognition" },
          { content: "Climate adaptation", description: "Physiology responds to a hotter world" },
          { content: "Consciousness uploading", description: "Mind migrates to synthetic substrate" },
          { content: "Slower, longer lives", description: "Longevity reshapes reproduction" },
        ],
      },
      {
        title: "Will cities become fully autonomous?",
        description: "Urban systems are evolving toward self-regulation. How far will the smart-city adaptation go?",
        category: "society",
        options: [
          { content: "AI-managed logistics", description: "Traffic, energy, waste optimized centrally" },
          { content: "Decentralized neighborhoods", description: "Local self-governance prevails" },
          { content: "Vertical green megastructures", description: "Dense, self-sufficient towers" },
          { content: "Nomadic digital hubs", description: "Cities dissolve into remote networks" },
          { content: "Surveillance equilibrium", description: "Safety traded for privacy" },
        ],
      },
    ];

    for (const t of topics) {
      await prisma.topic.create({
        data: {
          title: t.title,
          description: t.description,
          category: t.category,
          viewCount: Math.floor(Math.random() * 300),
          options: {
            create: t.options.map((o) => ({
              content: o.content,
              description: o.description,
              voteCount: Math.floor(Math.random() * 40),
            })),
          },
        },
      });
    }

    for (const topic of await prisma.topic.findMany({ include: { options: true } })) {
      const total = topic.options.reduce((sum, o) => sum + o.voteCount, 0);
      await prisma.topic.update({ where: { id: topic.id }, data: { voteCount: total } });
    }

    return NextResponse.json({ success: true, seeded: topics.length });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
