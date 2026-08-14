"use client";

import { useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { ContactModal } from "./ContactModal";

export function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <footer className="border-t border-void-700 bg-void-900/80 py-8 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} Evolutionary Prophecy. Predicting the future, one branch at a time.
        </div>
        <div className="flex items-center gap-4">
          <a href="mailto:hello@evolutionary-prophecy.com" className="text-sm text-slate-400 hover:text-white">
            hello@evolutionary-prophecy.com
          </a>
          <button
            onClick={() => setOpen(true)}
            className="btn-secondary flex items-center gap-1.5 text-sm"
          >
            <FiMessageCircle size={16} />
            Feedback
          </button>
        </div>
      </div>
      <ContactModal isOpen={open} onClose={() => setOpen(false)} currentPage={typeof window !== "undefined" ? window.location.pathname : undefined} />
    </footer>
  );
}
