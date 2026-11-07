import type { ReactNode } from "react";
import { Phone, Tag } from "lucide-react";
import { useT } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export const money = (n: number) => `$${n.toFixed(2)}`;

export function Header({ children }: { children?: ReactNode }) {
  const { t } = useT();
  return (
    <header className="px-5 pt-6 pb-4">
      <h1 className="text-[28px] font-bold leading-tight text-ink">{t("appName")}</h1>
      <div className="mt-2 flex gap-1.5" aria-hidden>
        <span className="h-1 w-[22px] rounded-full bg-primary" />
        <span className="h-1 w-[22px] rounded-full bg-snap" />
        <span className="h-1 w-[22px] rounded-full bg-gold-accent" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{t("tagline")}</p>
      {children}
    </header>
  );
}

export function Footer() {
  const { t } = useT();
  return (
    <footer className="mt-8 border-t border-border px-5 py-6">
      <div className="flex flex-col gap-3">
        <a href="tel:211" className="tap flex items-center justify-center gap-2 rounded-xl bg-ink px-4 font-semibold text-ink-foreground">
          <Phone className="h-5 w-5" aria-hidden /> {t("call211")}
        </a>
        <a href="tel:+18885243578" className="tap flex items-center justify-center gap-2 rounded-xl border-2 border-ink px-4 font-semibold text-ink">
          <Phone className="h-5 w-5" aria-hidden /> {t("snapLine")}
        </a>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">{t("footerNote")}</p>
    </footer>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border bg-card p-4", className)}>{children}</section>;
}

export function Badge({ variant, children }: { variant: "snap" | "not" | "deal" | "best"; children: ReactNode }) {
  const v = {
    snap: "bg-snap-soft text-snap",
    not: "bg-muted text-muted-foreground",
    deal: "bg-deal-soft text-deal",
    best: "bg-primary text-primary-foreground",
  }[variant];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-semibold", v)}>
      {variant === "deal" && <Tag className="h-3.5 w-3.5" aria-hidden />}
      {children}
    </span>
  );
}

export function SampleLabel() {
  const { t } = useT();
  return <p className="text-sm italic text-muted-foreground">{t("samplePrices")}</p>;
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[480px]">{children}</div>
    </div>
  );
}
