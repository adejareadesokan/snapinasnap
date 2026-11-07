import { createFileRoute } from "@tanstack/react-router";
import { RouteScreen } from "@/components/snap/RouteScreen";

export const Route = createFileRoute("/route")({
  head: () => ({
    meta: [
      { title: "Your route — SNAP in a Snap" },
      { name: "description", content: "Map and directions to your chosen SNAP/EBT stores." },
      { property: "og:title", content: "Your route — SNAP in a Snap" },
      { property: "og:description", content: "Map and directions to your chosen SNAP/EBT stores." },
    ],
  }),
  component: RouteScreen,
});
