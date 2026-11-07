import { createFileRoute } from "@tanstack/react-router";
import { LearnScreen } from "@/components/snap/LearnScreen";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn about EBT benefits — SNAP in a Snap" },
      { name: "description", content: "Learn what SNAP/EBT covers and find official Louisiana SNAP and WIC application resources." },
      { property: "og:title", content: "Learn about EBT benefits — SNAP in a Snap" },
      { property: "og:description", content: "Understand your benefits, eligible purchases, and how to apply in Louisiana." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LearnScreen,
});