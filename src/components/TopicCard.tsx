"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiBarChart2, FiEye } from "react-icons/fi";
import { CATEGORY_COLORS, CATEGORIES } from "@/lib/constants";
import { ShareButton } from "./ShareButton";
import type { TopicWithOptions } from "@/lib/types";

export function TopicCard({ topic }: { topic: TopicWithOptions }) {
  const category = CATEGORIES.find((c) => c.key === topic.category);
  const url = `https://evolutionary-prophecy.com/topic/${topic.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card-void flex h-full flex-col gap-3"
    >
      <Link href={`/topic/${topic.id}`} className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <span className={CATEGORY_COLORS[topic.category] ?? "tag-green"}>
            {category?.emoji} {category?.label ?? topic.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <FiEye size={14} /> {topic.viewCount}
          </span>
        </div>

        <h3 className="text-lg font-semibold leading-snug text-white">{topic.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-400">{topic.description}</p>

        <div className="mt-auto flex items-center justify-between border-t border-void-700 pt-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <FiBarChart2 size={14} className="text-neon-400" />
            {topic.voteCount} votes
          </span>
          <span>{topic.options.length} branches</span>
        </div>
      </Link>

      <div className="flex justify-end border-t border-void-700/50 pt-2">
        <ShareButton url={url} title={topic.title} description={topic.description} />
      </div>
    </motion.div>
  );
}
