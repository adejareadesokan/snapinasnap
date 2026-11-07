import { items, type CategoryFilter } from "@/data/snapData";

export function searchCatalog(query: string, category: CategoryFilter, itemName: (id: string) => string) {
  const q = query.trim().toLocaleLowerCase();
  if (!q && category === "All") return [];
  const results = items.filter((item) =>
    (category === "All" || item.category === category) &&
    (!q || item.name.toLocaleLowerCase().includes(q) || itemName(item.id).toLocaleLowerCase().includes(q)),
  );
  return q ? results.slice(0, 6) : results;
}