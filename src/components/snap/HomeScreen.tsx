import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bus, Car, Footprints, Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { Badge, Card, Footer, Header, Shell } from "./Shared";
import { useT, type Lang } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";
import { items, usualCart, zipCoords } from "@/data/snapData";
import type { Mode } from "@/lib/planner";
import { cn } from "@/lib/utils";

export function HomeScreen() {
  const { t, lang, setLang } = useT();
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
      <div className="flex justify-end px-5 pt-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          {t("language")}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="tap rounded-xl border border-border bg-card px-3 text-base"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </label>
      </div>
      <Header />
      <main className="flex flex-col gap-4 px-5">
        <Card>
          <label htmlFor="zip" className="font-semibold">{t("zipLabel")}</label>
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
            className="tap mt-2 w-full rounded-xl border border-input bg-card px-4 text-lg focus:outline-2 focus:outline-primary"
          />
          {showZipErr && <p id="zip-err" className="mt-2 text-base text-destructive">{t("zipError")}</p>}

          <fieldset className="mt-5">
            <legend className="font-semibold">{t("howGet")}</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {modes.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={trip.mode === id}
                  onClick={() => trip.setMode(id)}
                  className={cn(
                    "flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-xl border-2 px-2 text-sm font-semibold leading-tight",
                    trip.mode === id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        </Card>

        <Card>
          <h2 className="text-xl font-bold">{t("yourList")}</h2>
          <label htmlFor="search" className="mt-3 block text-base font-medium">{t("searchItems")}</label>
          <div className="relative mt-2">
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
                  <button
                    type="button"
                    onClick={() => { trip.addItem(i.id); setQuery(""); }}
                    className="tap flex items-center gap-1 rounded-xl bg-primary px-4 font-semibold text-primary-foreground"
                  >
                    <Plus className="h-4 w-4" aria-hidden /> {t("add")}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => { trip.setList(usualCart.map((e) => ({ ...e }))); setUsualLoaded(true); }}
            className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary px-4 font-semibold text-primary"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden /> {t("useUsual")}
          </button>
          <p className="mt-1 text-center text-sm text-muted-foreground">{t("basedOnPast")}</p>

          {trip.list.length === 0 ? (
            <p className="mt-4 text-muted-foreground">{t("emptyList")}</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-2">
              {usualLoaded && <li className="sr-only">{t("basedOnPast")}</li>}
              {trip.list.map((e) => {
                const item = items.find((i) => i.id === e.item)!;
                return (
                  <li key={e.item} className="rounded-xl border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="mt-1"><Badge variant={item.snap ? "snap" : "not"}>{item.snap ? t("snap") : t("notSnap")}</Badge></div>
                        {item.note && <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>}
                      </div>
                      <button type="button" aria-label={`${t("remove")} ${item.name}`} onClick={() => setQty(e.item, 0)} className="tap flex w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted">
                        <Trash2 className="h-5 w-5" aria-hidden />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{t("qty")}</span>
                      <button type="button" aria-label={t("decrease")} onClick={() => setQty(e.item, e.qty - 1)} className="tap flex w-11 items-center justify-center rounded-xl border border-border"><Minus className="h-4 w-4" aria-hidden /></button>
                      <span className="w-6 text-center font-semibold" aria-live="polite">{e.qty}</span>
                      <button type="button" aria-label={t("increase")} onClick={() => setQty(e.item, e.qty + 1)} className="tap flex w-11 items-center justify-center rounded-xl border border-border"><Plus className="h-4 w-4" aria-hidden /></button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {error && <p role="alert" className="text-base text-destructive">{error}</p>}
        <button type="button" onClick={onCompare} className="tap min-h-[52px] rounded-xl bg-primary px-4 text-lg font-bold text-primary-foreground">
          {t("compare")}
        </button>
      </main>
      <Footer />
    </Shell>
  );
}
