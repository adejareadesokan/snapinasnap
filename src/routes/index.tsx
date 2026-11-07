import { createFileRoute } from "@tanstack/react-router";
import { WelcomeScreen } from "@/components/snap/WelcomeScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SNAP in a Snap — Shopping, benefits, and help" },
      { name: "description", content: "Shop with EBT, learn about Louisiana benefits, or find someone to help with your questions." },
      { property: "og:title", content: "SNAP in a Snap — Shopping, benefits, and help" },
      { property: "og:description", content: "Choose grocery-trip planning, EBT information, or official contact options." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WelcomeScreen,
});
