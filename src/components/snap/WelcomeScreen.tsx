import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Phone, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/context/LanguageContext";
import { Footer, Header, Shell } from "./Shared";

const choices = [
  { to: "/shop", icon: ShoppingCart, title: "welcomeShopTitle", description: "welcomeShopDescription", variant: "welcome" },
  { to: "/learn", icon: BookOpen, title: "welcomeLearnTitle", description: "welcomeLearnDescription", variant: "welcomeInfo" },
  { to: "/help", icon: Phone, title: "welcomeHelpTitle", description: "welcomeHelpDescription", variant: "welcomeInfo" },
] as const;

export function WelcomeScreen() {
  const { t } = useT();
  return (
    <Shell>
      <Header />
      <main className="px-4 pt-6 pb-4">
        <h2 className="text-2xl font-bold leading-8">{t("welcomeHeadline")}</h2>
        <p className="mt-2 text-sm leading-5 text-muted-foreground">{t("welcomeSubtext")}</p>
        <nav className="mt-6 flex flex-col gap-3">
          {choices.map(({ to, icon: Icon, title, description, variant }) => (
            <Button key={to} asChild variant={variant}
              className="group grid h-auto min-h-32 w-full grid-cols-[auto_minmax(0,1fr)_auto] gap-3 rounded-lg p-4 text-left whitespace-normal shadow-none [&_svg]:size-6">
              <Link to={to}>
                <Icon aria-hidden strokeWidth={1.75} />
                <span className="min-w-0">
                  <span className="block text-base font-bold leading-6">{t(title)}</span>
                  <span className="mt-1 block text-sm font-normal leading-5">{t(description)}</span>
                </span>
                <ChevronRight aria-hidden className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </Link>
            </Button>
          ))}
        </nav>
      </main>
      <Footer />
    </Shell>
  );
}