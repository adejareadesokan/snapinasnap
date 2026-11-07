import { describe, expect, it } from "vitest";
import { items } from "@/data/snapData";
import { createResponsesCall } from "@/lib/ai/responses.server";
import { parseListInstructions } from "@/lib/parse-list.server";
import { normalizeParsedList } from "@/lib/parse-list";

// Opt-in real gateway checks; synthetic grocery text only, no input/output logging.
// Run with SNAP_LIVE_AI_TEST=1 when changing the meal-planning instructions.
describe.skipIf(process.env['SNAP_LIVE_AI_TEST'] !== "1")("Live AI meal rules", () => {
  it.each([
    { text: "Breakfast for the kids", lang: "en" as const, meal: "Breakfast", current: ["eggs"] },
    { text: "Algo para la cena", lang: "es" as const, meal: "Dinner", current: ["rice"] },
    { text: "đồ ăn trưa", lang: "vi" as const, meal: "Lunch", current: ["bread"] },
    { text: "Quelque chose pour le souper, s'il vous plaît, en français cadien de Louisiane", lang: "en" as const, meal: "Dinner", current: ["rice"] },
  ])("suggests a simple $meal using its category, never existing or unrequested restricted items", async ({ text, lang, meal, current }) => {
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) throw new Error("Live AI verification requires the configured gateway key");
    const { result } = createResponsesCall(
      new Request("http://localhost:8080"),
      { baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, model: "openai/gpt-6-astra" },
      [{ role: "user", content: text }],
      parseListInstructions(lang, current),
    );
    const parsed = normalizeParsedList(await result.output, current);
    expect(parsed.matches).toEqual([]);
    expect(parsed.not_found).toEqual([]);
    expect(parsed.suggestions.length).toBeGreaterThan(0);
    expect(parsed.suggestions.length).toBeLessThanOrEqual(3);
    const suggestedCategories = parsed.suggestions.map(({ item_id }) => items.find((item) => item.id === item_id)?.category);
    expect(suggestedCategories.every((category) => [meal, "Produce", "Snacks"].includes(category ?? ""))).toBe(true);
    expect(suggestedCategories.filter((category) => category === meal).length).toBeGreaterThan(parsed.suggestions.length / 2);
    expect(parsed.suggestions.some(({ item_id }) => current.includes(item_id))).toBe(false);
  }, 120000);

  it("still matches explicitly requested Pantry, Household, and Baby items with their quantities", async () => {
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) throw new Error("Live AI verification requires the configured gateway key");
    const { result } = createResponsesCall(
      new Request("http://localhost:8080"),
      { baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, model: "openai/gpt-6-astra" },
      [{ role: "user", content: "2 bags of flour, 1 laundry detergent, 3 packs of baby food jars" }],
      parseListInstructions("en"),
    );
    const parsed = normalizeParsedList(await result.output);
    expect(parsed.matches).toEqual(expect.arrayContaining([
      { item_id: "flour", qty: 2 }, { item_id: "laundry", qty: 1 }, { item_id: "baby_food", qty: 3 },
    ]));
    expect(parsed.matches).toHaveLength(3);
    expect(parsed.suggestions).toEqual([]);
    expect(parsed.not_found).toEqual([]);
  }, 120000);
});