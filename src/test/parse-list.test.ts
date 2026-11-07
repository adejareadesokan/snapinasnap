import { describe, expect, it } from "vitest";
import { addParsedMatches, normalizeParsedList, parseListSchema, type ParsedList } from "@/lib/parse-list";
import { parseListInstructions } from "@/lib/parse-list.server";
import { items } from "@/data/snapData";

const empty: ParsedList = { matches: [], suggestions: [], not_found: [] };

describe("AI list rules", () => {
  it("allows only catalog IDs in matches and suggestions", () => {
    const result = normalizeParsedList({ ...empty,
      matches: [{ item_id: "milk", qty: 1 }, { item_id: "invented", qty: 1 }],
      suggestions: [{ item_id: "eggs", reason: "Breakfast" }, { item_id: "invented", reason: "Invalid" }],
    });
    expect(result.matches).toEqual([{ item_id: "milk", qty: 1 }]);
    expect(result.suggestions).toEqual([{ item_id: "eggs", reason: "Breakfast" }]);
  });
  it("defaults invalid quantities to 1", () => {
    expect(normalizeParsedList({ ...empty, matches: [{ item_id: "milk", qty: 0 }] }).matches).toEqual([{ item_id: "milk", qty: 1 }]);
  });
  it("preserves stated quantities when adding matches to an existing list", () => {
    expect(addParsedMatches([{ item: "milk", qty: 1 }], [{ item_id: "milk", qty: 2 }, { item_id: "eggs", qty: 3 }])).toEqual([{ item: "milk", qty: 3 }, { item: "eggs", qty: 3 }]);
  });
  it("limits suggestions to 3 and does not add them automatically", () => {
    const result = normalizeParsedList({ ...empty, suggestions: ["rice", "chicken", "onions", "potatoes"].map((item_id) => ({ item_id, reason: "Dinner" })) });
    expect(result.suggestions.map((s) => s.item_id)).toEqual(["rice", "chicken", "onions"]);
    expect(addParsedMatches([], result.matches)).toEqual([]);
  });
  it("keeps unavailable requests separate from matches", () => {
    const result = normalizeParsedList({ ...empty, matches: [{ item_id: "milk", qty: 1 }], not_found: ["salmon"] });
    expect(result.not_found).toEqual(["salmon"]);
    expect(result.matches).toEqual([{ item_id: "milk", qty: 1 }]);
  });
  it("requires only the specified structured JSON fields", () => {
    expect(parseListSchema.safeParse({ ...empty, explanation: "Not permitted" }).success).toBe(false);
    expect(parseListSchema.safeParse({ matches: [], suggestions: [] }).success).toBe(false);
  });
  it("uses the same complete catalog as the existing search", () => {
    const catalog = parseListInstructions("en").split("Catalog (item IDs, names, and categories from the same data used by search):\n")[1];
    expect(JSON.parse(catalog ?? "null")).toEqual(items.map(({ id, name, category }) => ({ id, name, category })));
  });
  it("excludes current-list items from suggestions without blocking explicit quantity additions", () => {
    const result = normalizeParsedList({ ...empty,
      matches: [{ item_id: "milk", qty: 2 }],
      suggestions: ["bread", "turkey", "cheese_slices", "milk"].map((item_id) => ({ item_id, reason: "Lunch" })),
    }, ["bread", "milk"]);
    expect(result.suggestions.map((suggestion) => suggestion.item_id)).toEqual(["turkey", "cheese_slices"]);
    expect(addParsedMatches([{ item: "milk", qty: 1 }], result.matches)).toEqual([{ item: "milk", qty: 3 }]);
  });
  it("applies the three-suggestion cap after excluding existing items", () => {
    const result = normalizeParsedList({ ...empty,
      suggestions: ["bread", "turkey", "cheese_slices", "tuna", "tortillas"].map((item_id) => ({ item_id, reason: "Lunch" })),
    }, ["bread"]);
    expect(result.suggestions.map((suggestion) => suggestion.item_id)).toEqual(["turkey", "cheese_slices", "tuna"]);
  });
});