import { z } from "zod";
import { items } from "@/data/snapData";
import type { ListEntry } from "@/lib/planner";

export const parseListSchema = z.object({
  matches: z.array(z.object({ item_id: z.string(), qty: z.number() }).strict()),
  suggestions: z.array(z.object({ item_id: z.string(), reason: z.string() }).strict()),
  not_found: z.array(z.string()),
}).strict();

export type ParsedList = z.infer<typeof parseListSchema>;

const catalogIds = new Set(items.map((item) => item.id));

export function normalizeParsedList(input: ParsedList): ParsedList {
  const quantities = new Map<string, number>();
  for (const match of input.matches) {
    if (!catalogIds.has(match.item_id)) continue;
    const qty = Number.isFinite(match.qty) && match.qty > 0 ? match.qty : 1;
    const total = (quantities.get(match.item_id) ?? 0) + qty;
    if (Number.isFinite(total)) quantities.set(match.item_id, total);
  }
  const suggested = new Set<string>();
  const suggestions = input.suggestions.filter((suggestion) => {
    if (!catalogIds.has(suggestion.item_id) || quantities.has(suggestion.item_id) || suggested.has(suggestion.item_id)) return false;
    suggested.add(suggestion.item_id);
    return true;
  }).slice(0, 3);
  return {
    matches: Array.from(quantities, ([item_id, qty]) => ({ item_id, qty })),
    suggestions,
    not_found: [...new Set(input.not_found.map((item) => item.trim()).filter(Boolean))],
  };
}

export function addParsedMatches(list: ListEntry[], matches: ParsedList["matches"]): ListEntry[] {
  const next = list.map((entry) => ({ ...entry }));
  for (const match of matches) {
    if (!catalogIds.has(match.item_id) || !Number.isFinite(match.qty) || match.qty <= 0) continue;
    const existing = next.find((entry) => entry.item === match.item_id);
    if (existing) existing.qty += match.qty;
    else next.push({ item: match.item_id, qty: match.qty });
  }
  return next;
}