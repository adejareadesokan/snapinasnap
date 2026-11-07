import { createFileRoute } from "@tanstack/react-router";
import { CompareScreen } from "@/components/snap/CompareScreen";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare stores — SNAP in a Snap" },
      { name: "description", content: "Compare grocery and travel costs across SNAP/EBT stores." },
      { property: "og:title", content: "Compare stores — SNAP in a Snap" },
      { property: "og:description", content: "Compare grocery and travel costs across SNAP/EBT stores." },
    ],
  }),
  component: CompareScreen,
});
