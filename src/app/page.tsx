"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiTrendingUp, FiClock, FiEye } from "react-icons/fi";
import { TopicCard } from "@/components/TopicCard";
import { CATEGORIES, SORT_OPTIONS, type Category, type SortOption } from "@/lib/constants";
import type { TopicWithOptions } from "@/lib/types";

export default function HomePage() {
  const [topics, setTopics] = useState<TopicWithOptions[]>([]);
  const [category, setCategory] = useState<Category>("all");
  const [sort, setSort] = useState<SortOption>("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/topics?category=${category}&sort=${sort}&limit=24`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setTopics(data.topics ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [category, sort]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-void-700 bg-void-800/50 p-8 md:p-12">
        <div className="relative z-10 max-w-2xl space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold leading-tight text-white md:text-5xl"
          >
            Predict the future{" "}
            <span className="bg-gradient-to-r from-neon-400 to-bio-400 bg-clip-text text-transparent">
              through evolution
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 md:text-lg"
          >
            Explore prophecies, vote on evolutionary branches, and see where the
            community thinks humanity is heading.
          </motion.p>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-neon-500/10 blur-[80px]" />
      </section>

      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                category === c.key
                  ? "bg-neon-600 text-white shadow-[0_0_16px_rgba(34,197,94,0.4)]"
                  : "border border-void-700 bg-void-800 text-slate-400 hover:border-neon-500/40 hover:text-white"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all ${
                sort === s.key
                  ? "bg-void-700 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {s.key === "latest" && <FiClock size={14} />}
              {s.key === "popular" && <FiTrendingUp size={14} />}
              {s.key === "views" && <FiEye size={14} />}
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-void h-48 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      ) : topics.length === 0 ? (
        <div className="rounded-2xl border border-void-700 bg-void-800/50 p-12 text-center text-slate-400">
          <FiSearch className="mx-auto mb-3 text-3xl text-slate-500" />
          <p>No prophecies found in this category yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}
