import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { LoaderCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";
import { items } from "@/data/snapData";
import { parseList } from "@/lib/parse-list.functions";
import type { ParsedList } from "@/lib/parse-list";
import { Badge } from "./Shared";

export function AiListInput() {
  const { t, lang } = useT();
  const { addMatches, addItem } = useTrip();
  const readList = useServerFn(parseList);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ParsedList["suggestions"]>([]);
  const [notFound, setNotFound] = useState<string[]>([]);
  const pending = useRef(false);
  const mounted = useRef(false);
  const activeLanguage = useRef(lang);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  useEffect(() => {
    activeLanguage.current = lang;
    setSuggestions([]);
  }, [lang]);

  const submit = async () => {
    if (!text.trim() || pending.current) return;
    pending.current = true;
    setLoading(true);
    setError(false);
    setServiceError(null);
    setSuggestions([]);
    setNotFound([]);
    const requestedLanguage = lang;
    try {
      const result = await readList({ data: { text: text.trim(), lang: requestedLanguage } });
      if (!mounted.current) return;
      if ("error" in result) {
        setError(true);
        setServiceError(result.error.message);
        return;
      }
      addMatches(result.matches);
      setSuggestions(activeLanguage.current === requestedLanguage ? result.suggestions : []);
      setNotFound(result.not_found);
      setText("");
    } catch {
      if (mounted.current) setError(true);
    } finally {
      pending.current = false;
      if (mounted.current) setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <label htmlFor="ai-list" className="block text-sm font-medium">{t("aiListLabel")}</label>
      <textarea
        id="ai-list"
        value={text}
        placeholder={t("aiListPlaceholder")}
        onChange={(event) => setText(event.target.value)}
        disabled={loading}
        rows={2}
        aria-describedby={error ? "ai-list-error" : undefined}
        className="mt-1 min-h-16 w-full resize-y rounded-lg border border-input bg-card px-3 py-2 text-base focus:outline-2 focus:outline-primary disabled:opacity-60"
      />
      <Button
        type="button"
        disabled={loading || !text.trim()}
        onClick={submit}
        className="tap mt-1 h-auto w-full whitespace-normal rounded-lg px-3 text-sm font-semibold shadow-none"
      >
        {loading ? <LoaderCircle className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden /> : <Plus className="h-5 w-5" aria-hidden />}
        {loading ? t("aiListLoading") : t("aiListAdd")}
      </Button>
      {loading && <p role="status" className="sr-only">{t("aiListLoading")}</p>}
      {error && <p id="ai-list-error" role="alert" className="mt-2 text-base text-destructive">{t("aiListError")}{serviceError && <span className="mt-1 block">{serviceError}</span>}</p>}
      <div aria-live="polite">
        {suggestions.length > 0 && (
          <ul aria-label={t("mightNeed")} className="mt-2 flex flex-col gap-2">
            {suggestions.map((suggestion) => {
              const item = items.find((candidate) => candidate.id === suggestion.item_id);
              if (!item) return null;
              return (
                <li key={item.id} className="rounded-lg border border-border p-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium">{item.name}</p>
                      <div className="mt-1"><Badge variant={item.snap ? "snap" : "not"}>{item.snap ? t("snap") : t("notSnap")}</Badge></div>
                      <p className="mt-2 break-words text-sm text-muted-foreground">{suggestion.reason}</p>
                    </div>
                    <Button type="button" className="tap h-auto shrink-0 rounded-lg px-3 font-semibold shadow-none" onClick={() => {
                      addItem(item.id);
                      setSuggestions((current) => current.filter((entry) => entry.item_id !== item.id));
                    }}>
                      <Plus aria-hidden />{t("add")}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {notFound.length > 0 && <p className="mt-3 break-words text-base text-muted-foreground">{t("aiListNotFound", { items: notFound.join(", ") })}</p>}
      </div>
    </div>
  );
}