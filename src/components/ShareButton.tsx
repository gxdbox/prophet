"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShare2,
  FiX,
  FiLink,
  FiCheck,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
  FiMail,
} from "react-icons/fi";
import { FaRedditAlien, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButton({ url, title, description }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description ?? "");

  const platforms = [
    {
      name: "X / Twitter",
      icon: FiTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-slate-700 hover:text-white",
    },
    {
      name: "Facebook",
      icon: FiFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: FiLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-sky-600 hover:text-white",
    },
    {
      name: "Reddit",
      icon: FaRedditAlien,
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: "hover:bg-orange-600 hover:text-white",
    },
    {
      name: "Telegram",
      icon: FaTelegramPlane,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-green-500 hover:text-white",
    },
    {
      name: "Email",
      icon: FiMail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
      color: "hover:bg-amber-500 hover:text-white",
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`btn-secondary flex items-center gap-1.5 text-sm transition-all ${
          open ? "border-neon-500/50 text-neon-400" : ""
        }`}
        aria-label="Share"
      >
        {open ? <FiX size={16} /> : <FiShare2 size={16} />}
        Share
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-void-700 bg-void-800 p-3 shadow-2xl"
          >
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              Share this prophecy
            </div>

            <div className="grid grid-cols-4 gap-2">
              {platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={p.name}
                  className={`flex flex-col items-center gap-1 rounded-xl p-2 text-slate-400 transition-all ${p.color}`}
                >
                  <p.icon size={20} />
                  <span className="text-[10px]">{p.name.split(" ")[0]}</span>
                </a>
              ))}
            </div>

            <button
              onClick={copyLink}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-void-700 bg-void-900 py-2 text-sm text-slate-300 transition-all hover:border-neon-500/40 hover:text-white"
            >
              {copied ? <FiCheck size={16} className="text-neon-400" /> : <FiLink size={16} />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
