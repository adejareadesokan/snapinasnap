import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, Plus } from "lucide-react";
import { Badge, Card, Footer, Header, SampleLabel, Shell, money } from "./Shared";
import { useT } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";
import { config, deals, items, stores, zipCoords } from "@/data/snapData";
import { bestSplitPlan, singleStorePlans, type Plan } from "@/lib/planner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CompactDisclosure } from "./CompactDisclosure";

export function CompareScreen() {
  const { t } = useT();
  const trip = useTrip();
  const navigate = useNavigate();
  const [view, setView] = useState<"one" | "split">("one");
  const home = zipCoords[trip.zip];

  const singles = useMemo(() => (home ? singleStorePlans(trip.list, home, trip.mode) : []), [home, trip.list, trip.mode]);
  const split = useMemo(() => (home ? bestSplitPlan(trip.list, home, trip.mode) : null), [home, trip.list, trip.mode]);

  if (!home || trip.list.length === 0) {
    return (
      <Shell>
        <Header />
        <main className="px-3">
          <Card>
            <p>{t("needZipAndList")}</p>
            <Link to="/shop" className="tap mt-3 flex items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground">{t("goHome")}</Link>
          </Card>
        </main>
        <Footer />
      </Shell>
    );
  }

  const listIds = new Set(trip.list.map((e) => e.item));
  const listDeals = deals.filter((d) => listIds.has(d.item));
  const suggested = deals.filter((d) => !listIds.has(d.item)).slice(0, 3);
  const choose = (p: Plan) => { trip.setPlan({ kind: p.kind, storeIds: p.storeIds }); navigate({ to: "/trip" }); };
  const bestSingle = singles[0];
  if (!bestSingle) return null;

  return (
    <Shell>
      <Header />
      <main className="flex flex-col gap-2 px-3">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
        <Link to="/shop" className="tap inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
          <ArrowLeft className="h-5 w-5" aria-hidden /> {t("back")}
        </Link>
        <h2 className="min-w-0 text-lg font-bold">{t("compareTitle")}</h2>
        </div>
        <SampleLabel />

        <div role="tablist" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
          {(["one", "split"] as const).map((v) => (
            <Button key={v} variant="ghost" role="tab" aria-selected={view === v} onClick={() => setView(v)}
              className={cn("tap h-auto whitespace-normal rounded-lg px-2 text-sm font-semibold shadow-none", view === v ? "bg-primary text-primary-foreground" : "text-ink")}>
              {v === "one" ? t("oneStore") : t("split")}
            </Button>
          ))}
        </div>

        {view === "one" ? (
          singles.map((p, i) => i === 0
            ? <PlanCard key={p.storeIds[0]} plan={p} best onChoose={() => choose(p)} />
            : <CollapsedPlan key={p.storeIds[0]} plan={p} onChoose={() => choose(p)} />)
        ) : split ? (
          <>
            <Card className={cn(split.total < bestSingle.total ? "border-snap bg-snap-soft" : "border-gold-accent bg-deal-soft")}>
              <p className="font-semibold">
                {split.total < bestSingle.total
                  ? t("splitSaves", { amt: money(bestSingle.total - split.total) })
                  : t("splitNotWorth", { amt: money(split.total - bestSingle.total) })}
              </p>
            </Card>
            <PlanCard plan={split} best={split.total < bestSingle.total} onChoose={() => choose(split)} />
          </>
        ) : (
          <Card><p>{t("splitNone")}</p></Card>
        )}

        <CompactDisclosure title={t("dealsOnList")} count={listDeals.length}>
          <SampleLabel />
          {listDeals.length === 0 ? <p className="mt-2 text-muted-foreground">{t("noDealsOnList")}</p> : (
            <ul className="mt-2 flex flex-col gap-2">
              {listDeals.map((d) => <DealRow key={d.item + d.store} itemId={d.item} storeId={d.store} sale={d.sale_price} ends={d.ends} />)}
            </ul>
          )}
        </CompactDisclosure>

        {suggested.length > 0 && (
          <CompactDisclosure title={t("mightNeed")} count={suggested.length}>
            <ul className="mt-2 flex flex-col gap-2">
              {suggested.map((d) => (
                <DealRow key={d.item + d.store} itemId={d.item} storeId={d.store} sale={d.sale_price} ends={d.ends}
                  action={
                    <Button type="button" onClick={() => trip.addItem(d.item)} className="tap h-auto shrink-0 gap-1 rounded-lg px-3 font-semibold shadow-none">
                      <Plus className="h-4 w-4" aria-hidden /> {t("add")}
                    </Button>
                  } />
              ))}
            </ul>
          </CompactDisclosure>
        )}
      </main>
      <Footer />
    </Shell>
  );
}

function DealRow({ itemId, storeId, sale, ends, action }: { itemId: string; storeId: string; sale: number; ends: string; action?: React.ReactNode }) {
  const { t, itemName } = useT();
  const item = items.find((i) => i.id === itemId);
  const idx = stores.findIndex((s) => s.id === storeId);
  const store = stores[idx];
  if (!item || !store) return null;
  const was = item.prices[idx];
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border py-2 last:border-0">
      <div className="min-w-0">
        <div className="text-sm font-medium">{itemName(item.id)}</div>
        <div className="text-sm text-muted-foreground">{t("at")} {store.name}</div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge variant="deal">{t("deal")} · {t("ends", { d: ends })}</Badge>
          <span className="font-semibold text-deal">{money(sale)}</span>
          {was != null && <s className="text-sm text-muted-foreground">{money(was)}</s>}
        </div>
      </div>
      {action}
    </li>
  );
}

function CollapsedPlan({ plan, onChoose }: { plan: Plan; onChoose: () => void }) {
  const name = stores.find((store) => store.id === plan.storeIds[0])?.name ?? "";
  return (
    <Collapsible className="rounded-xl border border-border bg-card">
      <CollapsibleTrigger asChild>
        <Button type="button" variant="ghost" className="group tap grid h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] gap-2 rounded-xl px-3 text-left shadow-none">
          <span className="min-w-0 truncate text-sm" title={name}>{name}</span>
          <span className="shrink-0 text-sm font-bold">{money(plan.total)}</span>
          <ChevronDown className="shrink-0 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" aria-hidden />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent><PlanCard plan={plan} best={false} onChoose={onChoose} embedded /></CollapsibleContent>
    </Collapsible>
  );
}

function PlanCard({ plan, best, onChoose, embedded = false }: { plan: Plan; best: boolean; onChoose: () => void; embedded?: boolean }) {
  const { t, itemName } = useT();
  const trip = useTrip();
  const planStores = plan.storeIds.flatMap((id) => { const store = stores.find((s) => s.id === id); return store ? [store] : []; });
  const tLabel = trip.mode === "car" ? t("gas") : trip.mode === "bus" ? t("transit") : t("walkCost");

  return (
    <div className={cn("p-3", embedded ? "border-t border-border" : "rounded-xl border border-border bg-card", best && "border-2 border-primary")}>
      <div className="flex flex-wrap items-center gap-2">
        {best && <Badge variant="best">{t("best")}</Badge>}
        {plan.missing > 0 && <Badge variant="not">{t("itemsMissing", { n: plan.missing })}</Badge>}
      </div>
      {planStores.map((s, i) => (
        <div key={s.id} className="mt-2">
          <h3 className="text-base font-bold">
            {plan.kind === "split" && <span className="mr-1 text-base text-muted-foreground">{t("stop", { n: i + 1 })}:</span>}
            {s.name}
          </h3>
          <p className="text-xs text-muted-foreground">{s.address} · {t("hours")} {s.hours}</p>
        </div>
      ))}
      <p className="mt-1 text-xs text-muted-foreground">{t("milesAway", { m: plan.miles.toFixed(1) })}</p>

      <ul className="mt-2 flex flex-col gap-1 text-xs leading-4">
        {plan.lines.map((l) => {
          const item = items.find((i) => i.id === l.item);
          if (!item) return null;
          return (
            <li key={l.item} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <span className="min-w-0">
                {l.qty} × {itemName(item.id)}
                {plan.kind === "split" && l.storeId && <span className="text-sm text-muted-foreground"> ({t("stop", { n: plan.storeIds.indexOf(l.storeId) + 1 })})</span>}
                {l.deal && <span className="ml-1"><Badge variant="deal">{t("deal")} · {t("ends", { d: l.deal.ends })}</Badge></span>}
              </span>
              <span className={cn("shrink-0", l.unit == null ? "text-muted-foreground" : "font-medium")}>
                {l.unit == null ? t("notCarried") : money(l.unit * l.qty)}
              </span>
            </li>
          );
        })}
      </ul>

      <dl className="mt-2 flex flex-col gap-1 border-t border-border pt-2 text-sm">
        <Row label={t("groceries")} value={money(plan.groceries)} />
        <Row label={tLabel} value={money(plan.transport)} />
        {trip.mode === "bus" && <p className="text-sm text-muted-foreground">{config.transit_fare_label}</p>}
        <Row label={t("overall")} value={money(plan.total)} strong />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-snap-soft p-2 text-snap"><dt className="text-sm">{t("snapPart")}</dt><dd className="text-lg font-bold">{money(plan.snapSubtotal)}</dd></div>
          <div className="rounded-xl bg-muted p-2 text-muted-foreground"><dt className="text-sm">{t("cashPart")}</dt><dd className="text-lg font-bold">{money(plan.cashSubtotal)}</dd></div>
        </div>
      </dl>
      <div className="mt-2"><SampleLabel /></div>
      <Button type="button" onClick={onChoose} className="tap mt-2 h-auto w-full whitespace-normal rounded-lg px-3 font-bold shadow-none">{t("choose")}</Button>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)_auto] gap-2", strong && "text-lg font-bold")}>
      <dt>{label}</dt><dd>{value}</dd>
    </div>
  );
}

