import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/components/snap/HomeScreen";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop with EBT — SNAP in a Snap" },
      { name: "description", content: "Build your grocery list and compare food and transportation costs at SNAP/EBT stores in New Orleans." },
      { property: "og:title", content: "Shop with EBT — SNAP in a Snap" },
      { property: "og:description", content: "Plan your list and compare grocery and transportation costs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeScreen,
});