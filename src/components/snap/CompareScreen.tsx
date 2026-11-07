import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { Badge, Card, Footer, Header, SampleLabel, Shell, money } from "./Shared";
import { useT } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";
import { config, deals, items, stores, zipCoords } from "@/data/snapData";
import { bestSplitPlan, priceAt, singleStorePlans, type Plan } from "@/lib/planner";
import { cn } from "@/lib/utils";

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
        <main className="px-5">
          <Card>
            <p>{t("needZipAndList")}</p>
            <Link to="/" className="tap mt-3 flex items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground">{t("goHome")}</Link>
          </Card>
        </main>
        <Footer />
      </Shell>
    );
  }

  const listIds = new Set(trip.list.map((e) => e.item));
  const listDeals = deals.filter((d) => listIds.has(d.item));
  const suggested = deals.filter((d) => !listIds.has(d.item)).slice(0, 3);
  const choose = (p: Plan) => { trip.setPlan({ kind: p.kind, storeIds: p.storeIds }); navigate({ to: "/route" }); };
  const bestSingle = singles[0];

  return (
    <Shell>
      <Header />
      <main className="flex flex-col gap-4 px-5">
        <Link to="/" className="tap inline-flex w-fit items-center gap-1 font-semibold text-primary">
          <ArrowLeft className="h-5 w-5" aria-hidden /> {t("back")}
        </Link>
        <h2 className="text-[26px] font-bold">{t("compareTitle")}</h2>
        <SampleLabel />

        <div role="tablist" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
          {(["one", "split"] as const).map((v) => (
            <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)}
              className={cn("tap rounded-lg px-2 font-semibold", view === v ? "bg-primary text-primary-foreground" : "text-ink")}>
              {v === "one" ? t("oneStore") : t("split")}
            </button>
          ))}
        </div>

        {view === "one" ? (
          singles.map((p, i) => <PlanCard key={p.storeIds[0]} plan={p} best={i === 0} onChoose={() => choose(p)} />)
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

        <Card>
          <h3 className="text-xl font-bold">{t("dealsOnList")}</h3>
          <SampleLabel />
          {listDeals.length === 0 ? <p className="mt-2 text-muted-foreground">{t("noDealsOnList")}</p> : (
            <ul className="mt-2 flex flex-col gap-2">
              {listDeals.map((d) => <DealRow key={d.item + d.store} itemId={d.item} storeId={d.store} sale={d.sale_price} ends={d.ends} />)}
            </ul>
          )}
        </Card>

        {suggested.length > 0 && (
          <Card>
            <h3 className="text-xl font-bold">{t("mightNeed")}</h3>
            <ul className="mt-2 flex flex-col gap-2">
              {suggested.map((d) => (
                <DealRow key={d.item + d.store} itemId={d.item} storeId={d.store} sale={d.sale_price} ends={d.ends}
                  action={
                    <button type="button" onClick={() => trip.addItem(d.item)} className="tap flex items-center gap-1 rounded-xl bg-primary px-4 font-semibold text-primary-foreground">
                      <Plus className="h-4 w-4" aria-hidden /> {t("add")}
                    </button>
                  } />
              ))}
            </ul>
          </Card>
        )}
      </main>
      <Footer />
    </Shell>
  );
}

function DealRow({ itemId, storeId, sale, ends, action }: { itemId: string; storeId: string; sale: number; ends: string; action?: React.ReactNode }) {
  const { t } = useT();
  const item = items.find((i) => i.id === itemId)!;
  const idx = stores.findIndex((s) => s.id === storeId);
  const store = stores[idx];
  const was = item.prices[idx];
  return (
    <li className="flex items-center justify-between gap-2 rounded-xl border border-border p-3">
      <div>
        <div className="font-medium">{item.name}</div>
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

function PlanCard({ plan, best, onChoose }: { plan: Plan; best: boolean; onChoose: () => void }) {
  const { t } = useT();
  const trip = useTrip();
  const planStores = plan.storeIds.map((id) => stores.find((s) => s.id === id)!);
  const tLabel = trip.mode === "car" ? t("gas") : trip.mode === "bus" ? t("transit") : t("walkCost");

  return (
    <Card className={cn(best && "border-2 border-primary")}>
      <div className="flex flex-wrap items-center gap-2">
        {best && <Badge variant="best">{t("best")}</Badge>}
        {plan.missing > 0 && <Badge variant="not">{t("itemsMissing", { n: plan.missing })}</Badge>}
      </div>
      {planStores.map((s, i) => (
        <div key={s.id} className="mt-2">
          <h3 className="text-xl font-bold">
            {plan.kind === "split" && <span className="mr-1 text-base text-muted-foreground">{t("stop", { n: i + 1 })}:</span>}
            {s.name}
          </h3>
          <p className="text-sm text-muted-foreground">{s.address} · {t("hours")} {s.hours}</p>
        </div>
      ))}
      <p className="mt-1 text-sm text-muted-foreground">{t("milesAway", { m: plan.miles.toFixed(1) })}</p>

      <ul className="mt-3 flex flex-col gap-1 text-base">
        {plan.lines.map((l) => {
          const item = items.find((i) => i.id === l.item)!;
          return (
            <li key={l.item} className="flex justify-between gap-2">
              <span>
                {l.qty} × {item.name}
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

      <dl className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
        <Row label={t("groceries")} value={money(plan.groceries)} />
        <Row label={tLabel} value={money(plan.transport)} />
        {trip.mode === "bus" && <p className="text-sm text-muted-foreground">{config.transit_fare_label}</p>}
        <Row label={t("overall")} value={money(plan.total)} strong />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-snap-soft p-2 text-snap"><dt className="text-sm">{t("snapPart")}</dt><dd className="text-lg font-bold">{money(plan.snapSubtotal)}</dd></div>
          <div className="rounded-xl bg-muted p-2 text-muted-foreground"><dt className="text-sm">{t("cashPart")}</dt><dd className="text-lg font-bold">{money(plan.cashSubtotal)}</dd></div>
        </div>
      </dl>
      <p className="mt-2"><SampleLabel /></p>
      <button type="button" onClick={onChoose} className="tap mt-3 w-full rounded-xl bg-primary px-4 font-bold text-primary-foreground">{t("choose")}</button>
    </Card>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("flex justify-between", strong && "text-xl font-bold")}>
      <dt>{label}</dt><dd>{value}</dd>
    </div>
  );
}

// re-export for tests / reuse
export { priceAt };
