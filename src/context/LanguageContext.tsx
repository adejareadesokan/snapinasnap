import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import en from "@/i18n/en.json";
import es from "@/i18n/es.json";
import vi from "@/i18n/vi.json";

export type Lang = "en" | "es" | "vi";
type Key = keyof typeof en;
const dicts: Record<Lang, Record<Key, string>> = { en, es, vi };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: Key, vars?: Record<string, string | number>) => string };
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("snap-lang");
    if (saved === "en" || saved === "es" || saved === "vi") setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("snap-lang", l);
  };
  const t = useCallback(
    (k: Key, vars?: Record<string, string | number>) => {
      let s = dicts[lang][k] ?? dicts.en[k] ?? k;
      if (vars) for (const [v, val] of Object.entries(vars)) s = s.replace(`{${v}}`, String(val));
      return s;
    },
    [lang],
  );
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useT() {
  const c = useContext(LanguageContext);
  if (!c) throw new Error("useT outside LanguageProvider");
  return c;
}
