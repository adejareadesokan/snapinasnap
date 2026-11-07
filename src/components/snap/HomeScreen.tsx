import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bus, Car, Footprints, Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { Badge, Card, Footer, Header, Shell } from "./Shared";
import { useT } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";
import { items, usualCart, zipCoords } from "@/data/snapData";
import type { Mode } from "@/lib/planner";
import { cn } from "@/lib/utils";
import { AiListInput } from "./AiListInput";
import { Button } from "@/components/ui/button";

export function HomeScreen() {
  const { t } = useT();
  const trip = useTrip();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [touched, setTouched] = useState(false);
  const [usualLoaded, setUsualLoaded] = useState(false);
  const [error, setError] = useState("");

  const zipValid = !!zipCoords[trip.zip];
  const showZipErr = touched && trip.zip.length > 0 && !zipValid;

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items.filter((i) => i.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const modes: { id: Mode; icon: typeof Car; label: string }[] = [
    { id: "car", icon: Car, label: t("mode_car") },
    { id: "bus", icon: Bus, label: t("mode_bus") },
    { id: "walk", icon: Footprints, label: t("mode_walk") },
  ];

  const setQty = (id: string, qty: number) =>
    trip.setList(qty <= 0 ? trip.list.filter((e) => e.item !== id) : trip.list.map((e) => (e.item === id ? { ...e, qty } : e)));

  const onCompare = () => {
    setTouched(true);
    if (!zipValid || trip.list.length === 0) return setError(t(!zipValid ? "zipError" : "needZipAndList"));
    setError("");
    navigate({ to: "/compare" });
  };

  return (
    <Shell>
      <Header />
      <main className="flex flex-col gap-2 px-3 pb-14">
        <Card>
          <div className="grid grid-cols-[100px_minmax(0,1fr)] items-end gap-2">
          <div className="min-w-0">
          <label htmlFor="zip" className="block text-xs font-semibold leading-4">{t("zipLabel")}</label>
          <input
            id="zip"
            inputMode="numeric"
            maxLength={5}
            value={trip.zip}
            placeholder={t("zipPlaceholder")}
            onChange={(e) => trip.setZip(e.target.value.replace(/\D/g, ""))}
            onBlur={() => setTouched(true)}
            aria-invalid={showZipErr}
            aria-describedby="zip-err"
            className="tap mt-1 w-full rounded-lg border border-input bg-card px-2 text-base focus:outline-2 focus:outline-primary"
          />
          </div>

          <fieldset className="min-w-0">
            <legend className="text-xs font-semibold leading-4">{t("howGet")}</legend>
            <div className="mt-1 grid grid-cols-3 overflow-hidden rounded-lg border border-border">
              {modes.map(({ id, icon: Icon, label }) => (
                <Button
                  key={id}
                  type="button"
                  aria-pressed={trip.mode === id}
                  onClick={() => trip.setMode(id)}
                  className={cn(
                    "tap h-auto min-w-0 flex-col gap-0 rounded-none border-0 px-0.5 py-0 text-[10px] font-semibold leading-3 shadow-none whitespace-normal",
                    trip.mode === id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {label}
                </Button>
              ))}
            </div>
          </fieldset>
          </div>
          {showZipErr && <p id="zip-err" className="mt-2 text-sm text-destructive">{t("zipError")}</p>}
        </Card>

        <Card>
          <h2 className="text-lg font-bold">{t("yourList")}</h2>
          <AiListInput />
          <label htmlFor="search" className="mt-2 block text-sm font-medium">{t("searchItems")}</label>
          <div className="relative mt-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              id="search"
              value={query}
              placeholder={t("searchPlaceholder")}
              onChange={(e) => setQuery(e.target.value)}
              className="tap w-full rounded-xl border border-input bg-card pl-10 pr-4 text-base"
            />
          </div>
          {matches.length > 0 && (
            <ul className="mt-2 divide-y divide-border rounded-xl border border-border">
              {matches.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-2 px-3 py-2">
                  <div>
                    <div>{i.name}</div>
                    <Badge variant={i.snap ? "snap" : "not"}>{i.snap ? t("snap") : t("notSnap")}</Badge>
                  </div>
                  <Button
                    type="button"
                    onClick={() => { trip.addItem(i.id); setQuery(""); }}
                    className="tap h-auto shrink-0 gap-1 rounded-lg px-3 font-semibold shadow-none"
                  >
                    <Plus className="h-4 w-4" aria-hidden /> {t("add")}
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <Button
            type="button"
            onClick={() => { trip.setList(usualCart.map((e) => ({ ...e }))); setUsualLoaded(true); }}
            variant="outline"
            className="tap mt-2 h-auto w-full whitespace-normal rounded-lg border-primary px-3 font-semibold text-primary shadow-none"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden /> {t("useUsual")}
          </Button>
          <p className="mt-1 text-center text-xs text-muted-foreground">{t("basedOnPast")}</p>

          {trip.list.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">{t("emptyList")}</p>
          ) : (
            <ul className="mt-2 divide-y divide-border">
              {usualLoaded && <li className="sr-only">{t("basedOnPast")}</li>}
              {trip.list.map((e) => {
                const item = items.find((i) => i.id === e.item);
                if (!item) return null;
                return (
                  <li key={e.item} className="grid h-11 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-1">
                    <div className="min-w-0" title={[item.name, item.note].filter(Boolean).join(" · ")}>
                      <div className="truncate text-xs font-medium leading-4">{item.name}</div>
                      <div className="leading-4"><Badge variant={item.snap ? "snap" : "not"}>{item.snap ? t("snap") : t("notSnap")}</Badge></div>
                      {item.note && <p className="sr-only">{item.note}</p>}
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="sr-only">{t("qty")}</span>
                      <Button type="button" variant="ghost" size="icon" aria-label={t("decrease")} onClick={() => setQty(e.item, e.qty - 1)} className="tap h-11 w-11 rounded-lg"><Minus aria-hidden /></Button>
                      <span className="min-w-5 text-center text-sm font-semibold" aria-live="polite">{e.qty}</span>
                      <Button type="button" variant="ghost" size="icon" aria-label={t("increase")} onClick={() => setQty(e.item, e.qty + 1)} className="tap h-11 w-11 rounded-lg"><Plus aria-hidden /></Button>
                    </div>
                    <Button type="button" variant="ghost" size="icon" aria-label={`${t("remove")} ${item.name}`} onClick={() => setQty(e.item, 0)} className="tap h-11 w-11 rounded-lg text-muted-foreground"><Trash2 aria-hidden /></Button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {error && <p role="alert" className="text-base text-destructive">{error}</p>}
        <div className="fixed inset-x-0 bottom-14 z-40 bg-background">
          <div className="mx-auto max-w-[480px] px-3 py-1.5">
            <Button type="button" onClick={onCompare} className="tap h-11 w-full whitespace-normal rounded-lg px-3 text-base font-bold shadow-none">{t("compare")}</Button>
          </div>
        </div>
      </main>
      <Footer />
    </Shell>
  );
}
