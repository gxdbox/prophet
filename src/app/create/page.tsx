"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2, FiArrowLeft, FiLoader } from "react-icons/fi";
import { CATEGORIES } from "@/lib/constants";

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("technology");
  const [options, setOptions] = useState([
    { content: "", description: "" },
    { content: "", description: "" },
    { content: "", description: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function addOption() {
    if (options.length >= 8) return;
    setOptions([...options, { content: "", description: "" }]);
  }

  function removeOption(idx: number) {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== idx));
  }

  function updateOption(idx: number, field: "content" | "description", value: string) {
    const next = [...options];
    next[idx][field] = value;
    setOptions(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, options }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to create prophecy");
      setSubmitting(false);
      return;
    }

    router.push(`/topic/${data.topic.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <a href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <FiArrowLeft size={16} /> Back to prophecies
      </a>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-void space-y-6"
      >
        <h1 className="text-2xl font-bold text-white">Create a Prophecy</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm text-slate-400">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., How will humans evolve in 2100?"
              className="input-void w-full"
              maxLength={120}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the prediction context and what you are curious about..."
              className="input-void w-full resize-none"
              rows={4}
              maxLength={500}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-void w-full"
            >
              {CATEGORIES.filter((c) => c.key !== "all").map((c) => (
                <option key={c.key} value={c.key}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">Evolutionary Branches</label>
              <button
                type="button"
                onClick={addOption}
                disabled={options.length >= 8}
                className="flex items-center gap-1 text-sm text-neon-400 hover:text-neon-300 disabled:opacity-40"
              >
                <FiPlus size={14} /> Add branch
              </button>
            </div>

            {options.map((opt, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={opt.content}
                  onChange={(e) => updateOption(idx, "content", e.target.value)}
                  placeholder={`Branch ${idx + 1}`}
                  className="input-void flex-1"
                  maxLength={80}
                  required
                />
                <input
                  value={opt.description}
                  onChange={(e) => updateOption(idx, "description", e.target.value)}
                  placeholder="Short description"
                  className="input-void hidden flex-1 sm:block"
                  maxLength={120}
                />
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  disabled={options.length <= 2}
                  className="rounded-xl px-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
            {submitting ? <FiLoader className="animate-spin" /> : null}
            {submitting ? "Creating..." : "Create Prophecy"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
