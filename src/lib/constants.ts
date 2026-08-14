export const CATEGORIES = [
  { key: "all", label: "All", emoji: "🌐" },
  { key: "technology", label: "Technology", emoji: "🚀" },
  { key: "biology", label: "Biology", emoji: "🧬" },
  { key: "culture", label: "Culture", emoji: "🎭" },
  { key: "life", label: "Life", emoji: "🌿" },
  { key: "society", label: "Society", emoji: "🏛️" },
] as const;

export type Category = (typeof CATEGORIES)[number]["key"];

export const CATEGORY_COLORS: Record<string, string> = {
  technology: "tag-blue",
  biology: "tag-green",
  culture: "tag-purple",
  life: "tag-amber",
  society: "tag-blue",
};

export const SORT_OPTIONS = [
  { key: "latest", label: "Latest" },
  { key: "popular", label: "Most Voted" },
  { key: "views", label: "Most Viewed" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["key"];
