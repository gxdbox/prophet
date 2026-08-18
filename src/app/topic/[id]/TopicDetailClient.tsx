"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiBarChart2, FiEye, FiPlus, FiArrowLeft, FiCheck } from "react-icons/fi";
import Link from "next/link";
import { CATEGORY_COLORS, CATEGORIES } from "@/lib/constants";
import { ShareButton } from "@/components/ShareButton";
import type { TopicWithOptions } from "@/lib/types";

interface Props {
  topic: TopicWithOptions;
}

export function TopicDetailClient({ topic: initial }: Props) {
  const [topic, setTopic] = useState<TopicWithOptions>(initial);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(() => {
    if (typeof document === "undefined") return null;
    try {
      const match = document.cookie.match(new RegExp("(?:^|; )evp_votes=([^;]*)"));
      const votes = match ? JSON.parse(decodeURIComponent(match[1])) : {};
      return votes[initial.id] ?? null;
    } catch {
      return null;
    }
  });
  const [adding, setAdding] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const totalVotes = topic.voteCount;

  async function handleVote(optionId: string) {
    const res = await fetch(`/api/topics/${topic.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId }),
    });
    const data = await res.json();
    if (!res.ok) return;

    setTopic((prev) => ({
      ...prev,
      voteCount: data.topic.voteCount,
      options: prev.options.map((o) => {
        if (o.id === data.option.id) {
          return { ...o, voteCount: data.option.voteCount };
        }
        if (data.previousOption && o.id === data.previousOption.id) {
          return { ...o, voteCount: data.previousOption.voteCount };
        }
        return o;
      }),
    }));
    setVotedOptionId(data.voted);
  }

  async function handleAddBranch(e: React.FormEvent) {
    e.preventDefault();
    if (!newContent.trim()) return;

    const res = await fetch(`/api/topics/${topic.id}/options`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent, description: newDesc }),
    });

    if (!res.ok) return;

    const { option } = await res.json();
    setTopic((prev) => ({ ...prev, options: [...prev.options, option] }));
    setNewContent("");
    setNewDesc("");
    setAdding(false);
  }

  const category = CATEGORIES.find((c) => c.key === topic.category);

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
      >
        <FiArrowLeft size={16} /> Back to prophecies
      </Link>

      <section className="card-void space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className={CATEGORY_COLORS[topic.category] ?? "tag-green"}>
            {category?.emoji} {category?.label ?? topic.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <FiEye size={14} /> {topic.viewCount} views
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <FiBarChart2 size={14} className="text-neon-400" /> {topic.voteCount} votes
          </span>
          <div className="ml-auto">
            <ShareButton
              url={`https://prophet.lifelong-growth.com/topic/${topic.id}`}
              title={topic.title}
              description={topic.description}
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white md:text-4xl">{topic.title}</h1>
        <p className="max-w-3xl text-slate-300 md:text-lg">{topic.description}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Evolutionary Branches</h2>

        {topic.options.length === 0 ? (
          <p className="text-slate-400">No branches yet. Be the first to add one.</p>
        ) : (
          <div className="space-y-3">
            {topic.options
              .sort((a, b) => b.voteCount - a.voteCount)
              .map((option, idx) => {
                const percentage = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0;
                const isVoted = votedOptionId === option.id;

                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="card-void relative overflow-hidden"
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-neon-600/10 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="relative flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{option.content}</h3>
                          {isVoted && <FiCheck className="text-neon-400" />}
                        </div>
                        {option.description && (
                          <p className="text-sm text-slate-400">{option.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-neon-400">
                          {option.voteCount} ({percentage}%)
                        </span>
                        <button
                          onClick={() => handleVote(option.id)}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                            isVoted
                              ? "bg-neon-600 text-white"
                              : "border border-void-600 bg-void-900 text-slate-300 hover:border-neon-500/50 hover:text-white"
                          }`}
                        >
                          {isVoted ? "Voted" : "Vote"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        )}

        {!adding ? (
          <button
            onClick={() => setAdding(true)}
            className="btn-secondary flex items-center gap-1.5 text-sm"
          >
            <FiPlus size={16} /> Add a branch
          </button>
        ) : (
          <form onSubmit={handleAddBranch} className="card-void space-y-3">
            <h3 className="font-medium text-white">Add new branch</h3>
            <input
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Branch name"
              className="input-void w-full"
              maxLength={80}
              required
            />
            <input
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Short description (optional)"
              className="input-void w-full"
              maxLength={120}
            />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm">
                Add Branch
              </button>
              <button type="button" onClick={() => setAdding(false)} className="btn-secondary text-sm">
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
