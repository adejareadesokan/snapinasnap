import { config, deals, items, stores, type Deal, type Store } from "@/data/snapData";

export type Mode = "car" | "bus" | "walk";
export type ListEntry = { item: string; qty: number };
export type LatLng = [number, number];

export function miles(a: LatLng, b: LatLng): number {
  const R = 3958.8;
  const toR = (d: number) => (d * Math.PI) / 180;
  const dLat = toR(b[0] - a[0]);
  const dLng = toR(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a[0])) * Math.cos(toR(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const pt = (s: Store): LatLng => [s.lat, s.lng];

export function findDeal(itemId: string, storeId: string): Deal | undefined {
  return deals.find((d) => d.item === itemId && d.store === storeId);
}

/** Effective unit price of an item at a store (deal applied), or null if not carried. */
export function priceAt(itemId: string, storeId: string): number | null {
  const item = items.find((i) => i.id === itemId);
  const idx = stores.findIndex((s) => s.id === storeId);
  if (!item || idx < 0) return null;
  const base = item.prices[idx];
  if (base == null) return null;
  const deal = findDeal(itemId, storeId);
  return deal ? deal.sale_price : base;
}

/** Round-trip transport cost for visiting the given stores in order from home. */
export function transport(home: LatLng, visit: Store[], mode: Mode): { cost: number; miles: number } {
  let dist = 0;
  let prev = home;
  for (const s of visit) {
    dist += miles(prev, pt(s));
    prev = pt(s);
  }
  dist += miles(prev, home);
  if (mode === "car") return { cost: dist * config.gas_cost_per_mile, miles: dist };
  if (mode === "bus") return { cost: 2 * config.transit_fare_one_way * visit.length, miles: dist };
  return { cost: config.walk_cost, miles: dist };
}

export type LineResult = { item: string; qty: number; storeId: string | null; unit: number | null; deal?: Deal };

export type Plan = {
  kind: "one" | "split";
  storeIds: string[];
  lines: LineResult[];
  groceries: number;
  transport: number;
  miles: number;
  total: number;
  snapSubtotal: number;
  cashSubtotal: number;
  missing: number;
};

function summarize(kind: Plan["kind"], visit: Store[], lines: LineResult[], home: LatLng, mode: Mode): Plan {
  let groceries = 0, snapSub = 0, missing = 0;
  for (const l of lines) {
    if (l.unit == null) { missing++; continue; }
    const amt = l.unit * l.qty;
    groceries += amt;
    if (items.find((i) => i.id === l.item)?.snap) snapSub += amt;
  }
  const t = transport(home, visit, mode);
  return {
    kind, storeIds: visit.map((s) => s.id), lines, groceries, transport: t.cost, miles: t.miles,
    total: groceries + t.cost, snapSubtotal: snapSub, cashSubtotal: groceries - snapSub, missing,
  };
}

export function singleStorePlans(list: ListEntry[], home: LatLng, mode: Mode): Plan[] {
  return stores
    .map((s) =>
      summarize("one", [s], list.map((e) => ({
        item: e.item, qty: e.qty, storeId: s.id, unit: priceAt(e.item, s.id), deal: findDeal(e.item, s.id),
      })), home, mode),
    )
    .sort((a, b) => a.missing - b.missing || a.total - b.total);
}

/** Best plan using at most 2 stores, picking the cheapest store per item. */
export function bestSplitPlan(list: ListEntry[], home: LatLng, mode: Mode): Plan | null {
  let best: Plan | null = null;
  for (let i = 0; i < stores.length; i++) {
    for (let j = i + 1; j < stores.length; j++) {
      const pair = [stores[i], stores[j]];
      const lines: LineResult[] = list.map((e) => {
        let pick: { s: Store; p: number } | null = null;
        for (const s of pair) {
          const p = priceAt(e.item, s.id);
          if (p != null && (!pick || p < pick.p)) pick = { s, p };
        }
        return { item: e.item, qty: e.qty, storeId: pick?.s.id ?? null, unit: pick?.p ?? null, deal: pick ? findDeal(e.item, pick.s.id) : undefined };
      });
      const used = pair.filter((s) => lines.some((l) => l.storeId === s.id));
      if (used.length < 2) continue;
      // Order visits by nearer-first
      used.sort((a, b) => miles(home, pt(a)) - miles(home, pt(b)));
      const plan = summarize("split", used, lines, home, mode);
      if (!best || plan.missing < best.missing || (plan.missing === best.missing && plan.total < best.total)) best = plan;
    }
  }
  return best;
}

export function detourMinutes(home: LatLng, visit: Store[], extra: LatLng, mode: Mode): number {
  const base = transport(home, visit, mode).miles;
  // Best insertion point of the extra stop into the route
  const pts: LatLng[] = [home, ...visit.map(pt), home];
  let bestAdd = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const add = miles(pts[i], extra) + miles(extra, pts[i + 1]) - miles(pts[i], pts[i + 1]);
    bestAdd = Math.min(bestAdd, add);
  }
  void base;
  const perMile = mode === "car" ? 2 : mode === "bus" ? 5 : 20;
  return Math.max(1, Math.round(bestAdd * perMile));
}

export function isAppleDevice(ua: string, maxTouchPoints: number): boolean {
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && maxTouchPoints > 1);
}

export function directionsUrl(address: string, mode: Mode, apple: boolean): string {
  const a = encodeURIComponent(address);
  if (apple) return `https://maps.apple.com/?daddr=${a}&dirflg=${mode === "car" ? "d" : mode === "bus" ? "r" : "w"}`;
  return googleUrl(address, mode);
}

export function googleUrl(address: string, mode: Mode): string {
  const tm = mode === "car" ? "driving" : mode === "bus" ? "transit" : "walking";
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=${tm}`;
}
