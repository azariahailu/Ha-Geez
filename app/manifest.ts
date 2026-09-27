import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ሀ ግእዝ",
    short_name: "ሀ ግእዝ",
    description: "A Ge'ez to Amharic dictionary. Search a word, or send one you know.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3ead7",
    theme_color: "#f3ead7",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
