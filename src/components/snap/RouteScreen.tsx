import { lazy, Suspense, useEffect, useState } from "react";
import { ClientOnly, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronDown, Clock, Navigation, Save } from "lucide-react";
import { Card, Footer, Header, Shell } from "./Shared";
import { useT } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";
import { extras, stores, zipCoords } from "@/data/snapData";
import { detourMinutes, directionsUrl, googleUrl, isAppleDevice } from "@/lib/planner";
import type { MapPoint } from "./RouteMap";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const RouteMap = lazy(() => import("./RouteMap"));

export function RouteScreen() {
  const { t } = useT();
  const trip = useTrip();
  const [apple, setApple] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => setApple(isAppleDevice(navigator.userAgent, navigator.maxTouchPoints)), []);

  const home = zipCoords[trip.zip];
  const visit = (trip.plan?.storeIds ?? []).flatMap((id) => { const store = stores.find((s) => s.id === id); return store ? [store] : []; });

  if (!home || visit.length === 0) {
    return (
      <Shell>
        <Header />
        <main className="px-3">
          <Card>
            <p>{t("noPlan")}</p>
            <Link to="/compare" className="tap mt-3 flex items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground">{t("goCompare")}</Link>
          </Card>
        </main>
        <Footer />
      </Shell>
    );
  }

  const along = extras
    .map((e) => ({ e, min: detourMinutes(home, visit, [e.lat, e.lng], trip.mode) }))
    .filter((x) => x.min <= 10)
    .sort((a, b) => a.min - b.min);

  const points: MapPoint[] = [
    { pos: home, label: `${t("you")}: ${trip.zip}`, kind: "home" },
    ...visit.map((s, i) => ({ pos: [s.lat, s.lng] as [number, number], label: s.name, kind: "store" as const, n: i + 1 })),
    ...along.map(({ e }) => ({ pos: [e.lat, e.lng] as [number, number], label: e.name, kind: "extra" as const })),
  ];

  const save = () => {
    localStorage.setItem("snap-saved-list", JSON.stringify({ list: trip.list, zip: trip.zip, mode: trip.mode, savedAt: new Date().toISOString() }));
    setSaved(true);
  };

  return (
    <Shell>
      <Header />
      <main className="flex flex-col gap-2 px-3">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
        <Link to="/compare" className="tap inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
          <ArrowLeft className="h-5 w-5" aria-hidden /> {t("back")}
        </Link>
        <h2 className="min-w-0 text-lg font-bold">{t("routeTitle")}</h2>
        </div>

        <ClientOnly fallback={<div className="h-[220px] w-full rounded-xl bg-muted" />}>
          <Suspense fallback={<div className="h-[220px] w-full rounded-xl bg-muted" />}>
            <RouteMap points={points} />
          </Suspense>
        </ClientOnly>

        {visit.map((s, i) => (
          <Card key={s.id}>
            <p className="text-xs font-semibold text-muted-foreground">{t("stop", { n: i + 1 })}</p>
            <h3 className="text-base font-bold">{s.name}</h3>
            <p className="text-sm text-muted-foreground">{s.address}</p>
            <p className="text-xs text-muted-foreground">{t("hours")} {s.hours}</p>
            <DirLinks address={s.address} apple={apple} />
          </Card>
        ))}

        <Card>
          <h3 className="text-base font-bold">{t("alongWay")}</h3>
          {along.length === 0 ? <p className="mt-2 text-muted-foreground">{t("noneAlong")}</p> : (
            <ul className="mt-2 divide-y divide-border">
              {along.map(({ e, min }) => (
                <li key={e.id}>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button type="button" variant="ghost" className="group tap grid h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] gap-1 rounded-lg px-0 text-left shadow-none">
                        <span className="min-w-0 truncate text-xs font-semibold" title={e.name}>{e.name}</span>
                        <span className="shrink-0 rounded-full bg-deal-soft px-2 py-0.5 text-xs font-bold text-deal">{t("plusMin", { n: min })}</span>
                        <ChevronDown className="shrink-0 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" aria-hidden />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pb-2">
                  <p className="text-sm font-semibold">{e.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm"><Clock className="h-4 w-4" aria-hidden /> {e.when}</p>
                  <p className="text-sm text-muted-foreground">{e.note}</p>
                  <DirLinks address={e.address} apple={apple} />
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Button type="button" onClick={save} className="tap h-auto whitespace-normal rounded-lg bg-ink px-3 font-bold text-ink-foreground shadow-none">
          {saved ? <Check className="h-5 w-5" aria-hidden /> : <Save className="h-5 w-5" aria-hidden />}
          {saved ? t("saved") : t("saveList")}
        </Button>
        <p className="text-center text-xs text-muted-foreground">{t("accountSoon")}</p>
      </main>
      <Footer />
    </Shell>
  );

  function DirLinks({ address, apple }: { address: string; apple: boolean }) {
    return (
      <div className="mt-2">
        <a href={directionsUrl(address, trip.mode, apple)} target="_blank" rel="noopener noreferrer"
          className="tap flex items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground">
          <Navigation className="h-5 w-5" aria-hidden /> {t("directions")}
        </a>
        {apple && (
          <a href={googleUrl(address, trip.mode)} target="_blank" rel="noopener noreferrer" className="tap mt-1 flex items-center justify-center text-sm font-medium text-primary underline">
            {t("openGoogle")}
          </a>
        )}
      </div>
    );
  }
}
