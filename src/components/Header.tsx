"use client";

import Link from "next/link";
import { FiPlus, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-void-700 bg-void-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
          <span className="text-2xl">🧬</span>
          <span className="bg-gradient-to-r from-neon-400 to-bio-400 bg-clip-text text-transparent">
            Evolutionary Prophecy
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm text-slate-300 transition-colors hover:text-white">
            Explore
          </Link>
          <Link
            href="/create"
            className="btn-primary flex items-center gap-1.5 text-sm"
          >
            <FiPlus size={16} />
            New Prophecy
          </Link>
        </nav>

        <button className="text-slate-300 md:hidden" onClick={() => setOpen(!open)}>
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-void-700 px-4 py-4 md:hidden">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block py-2 text-slate-300"
          >
            Explore
          </Link>
          <Link
            href="/create"
            onClick={() => setOpen(false)}
            className="btn-primary mt-2 flex w-fit items-center gap-1.5 text-sm"
          >
            <FiPlus size={16} />
            New Prophecy
          </Link>
        </div>
      )}
    </header>
  );
}
