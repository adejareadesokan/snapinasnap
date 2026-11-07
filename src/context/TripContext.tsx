import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { ListEntry, Mode } from "@/lib/planner";

type Trip = { zip: string; mode: Mode; list: ListEntry[]; plan: { kind: "one" | "split"; storeIds: string[] } | null };
type Ctx = Trip & {
  setZip: (z: string) => void;
  setMode: (m: Mode) => void;
  setList: (l: ListEntry[]) => void;
  addItem: (id: string) => void;
  setPlan: (p: Trip["plan"]) => void;
};
const TripContext = createContext<Ctx | null>(null);
const KEY = "snap-trip";

export function TripProvider({ children }: { children: ReactNode }) {
  const [trip, setTrip] = useState<Trip>({ zip: "", mode: "car", list: [], plan: null });
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setTrip(JSON.parse(raw));
    } catch { /* ignore */ }
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (loaded.current) sessionStorage.setItem(KEY, JSON.stringify(trip));
  }, [trip]);

  const value: Ctx = {
    ...trip,
    setZip: (zip) => setTrip((t) => ({ ...t, zip })),
    setMode: (mode) => setTrip((t) => ({ ...t, mode })),
    setList: (list) => setTrip((t) => ({ ...t, list })),
    addItem: (id) =>
      setTrip((t) => ({
        ...t,
        list: t.list.some((e) => e.item === id)
          ? t.list.map((e) => (e.item === id ? { ...e, qty: e.qty + 1 } : e))
          : [...t.list, { item: id, qty: 1 }],
      })),
    setPlan: (plan) => setTrip((t) => ({ ...t, plan })),
  };
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const c = useContext(TripContext);
  if (!c) throw new Error("useTrip outside TripProvider");
  return c;
}
