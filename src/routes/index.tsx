import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/components/snap/HomeScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SNAP in a Snap — Plan your grocery trip" },
      { name: "description", content: "Build a shopping list and find SNAP/EBT stores in New Orleans." },
      { property: "og:title", content: "SNAP in a Snap — Plan your grocery trip" },
      { property: "og:description", content: "Build a shopping list and find SNAP/EBT stores in New Orleans." },
    ],
  }),
  component: HomeScreen,
});
