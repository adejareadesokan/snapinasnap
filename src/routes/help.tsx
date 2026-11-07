import { createFileRoute } from "@tanstack/react-router";
import { HelpScreen } from "@/components/snap/HelpScreen";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "EBT help and contacts — SNAP in a Snap" },
      { name: "description", content: "Find official Louisiana SNAP telephone help and free local services through 211." },
      { property: "og:title", content: "EBT help and contacts — SNAP in a Snap" },
      { property: "og:description", content: "Talk to someone about EBT, applying, and finding local support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HelpScreen,
});