import type { ReactNode } from "react";
import { Phone, Tag } from "lucide-react";
import { useT, type Lang } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export const money = (n: number) => `$${n.toFixed(2)}`;

export function Header({ children }: { children?: ReactNode }) {
  const { t, lang, setLang } = useT();
  return (
    <header className="px-3 pb-2">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-lg font-bold leading-tight text-ink">{t("appName")}</h1>
          <div className="flex shrink-0 gap-0.5" aria-hidden>
            <span className="h-1 w-2 rounded-full bg-primary" />
            <span className="h-1 w-2 rounded-full bg-snap" />
            <span className="h-1 w-2 rounded-full bg-gold-accent" />
          </div>
        </div>
        <label className="shrink-0">
          <span className="sr-only">{t("language")}</span>
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} className="tap max-w-28 rounded-lg border border-border bg-card px-2 text-sm">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </label>
      </div>
      <p className="text-xs leading-4 text-muted-foreground">{t("footerNote")}</p>
      {children}
    </header>
  );
}

export function Footer() {
  const { t } = useT();
  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 h-14 border-t border-border bg-card">
      <div className="mx-auto grid h-full max-w-[480px] grid-cols-2 items-center gap-2 px-3">
        <a href="tel:211" className="tap grid grid-cols-[auto_minmax(0,1fr)] items-center gap-1.5 rounded-lg bg-ink px-2 text-center text-xs font-semibold leading-4 text-ink-foreground">
          <Phone className="h-4 w-4 shrink-0" aria-hidden /> <span className="min-w-0">{t("call211")}</span>
        </a>
        <a href="tel:+18885243578" className="tap grid grid-cols-[auto_minmax(0,1fr)] items-center gap-1.5 rounded-lg border border-ink px-2 text-center text-xs font-semibold leading-4 text-ink">
          <Phone className="h-4 w-4 shrink-0" aria-hidden /> <span className="min-w-0">{t("snapLine")}</span>
        </a>
      </div>
    </footer>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-xl border border-border bg-card p-3", className)}>{children}</section>;
}

export function Badge({ variant, children }: { variant: "snap" | "not" | "deal" | "best"; children: ReactNode }) {
  const v = {
    snap: "bg-snap-soft text-snap",
    not: "bg-muted text-muted-foreground",
    deal: "bg-deal-soft text-deal",
    best: "bg-primary text-primary-foreground",
  }[variant];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold leading-4", v)}>
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
    <div className="min-h-screen bg-background pb-[68px]">
      <div className="mx-auto max-w-[480px]">{children}</div>
    </div>
  );
}
