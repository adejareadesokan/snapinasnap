import { describe, expect, it } from "vitest";
import { categories, items, usualCart } from "@/data/snapData";
import { searchCatalog } from "@/lib/catalog";
import en from "@/i18n/en.json";
import es from "@/i18n/es.json";
import vi from "@/i18n/vi.json";

// Literal expected values from the supplied catalog, independent of app data.
const expectedCatalog = [
  {
    "id": "eggs",
    "category": "Breakfast",
    "snap": true,
    "prices": [
      3.29,
      2.99,
      3.49,
      2.79,
      3.69
    ]
  },
  {
    "id": "milk",
    "category": "Breakfast",
    "snap": true,
    "prices": [
      3.79,
      3.49,
      3.99,
      3.29,
      4.19
    ]
  },
  {
    "id": "cereal",
    "category": "Breakfast",
    "snap": true,
    "prices": [
      3.49,
      2.99,
      3.79,
      3.29,
      3.99
    ]
  },
  {
    "id": "oatmeal",
    "category": "Breakfast",
    "snap": true,
    "prices": [
      2.99,
      2.69,
      3.19,
      2.59,
      3.39
    ]
  },
  {
    "id": "grits",
    "category": "Breakfast",
    "snap": true,
    "prices": [
      2.49,
      2.29,
      2.69,
      2.19,
      2.79
    ]
  },
  {
    "id": "pancake_mix",
    "category": "Breakfast",
    "snap": true,
    "prices": [
      2.99,
      2.69,
      3.19,
      2.59,
      3.39
    ]
  },
  {
    "id": "syrup",
    "category": "Breakfast",
    "snap": true,
    "prices": [
      2.79,
      2.59,
      2.99,
      2.49,
      3.19
    ]
  },
  {
    "id": "bacon",
    "category": "Breakfast",
    "snap": true,
    "prices": [
      5.49,
      4.99,
      5.79,
      4.79,
      null
    ]
  },
  {
    "id": "butter",
    "category": "Breakfast",
    "snap": true,
    "prices": [
      4.29,
      3.99,
      4.49,
      3.79,
      4.69
    ]
  },
  {
    "id": "oj",
    "category": "Breakfast",
    "snap": true,
    "prices": [
      3.99,
      3.69,
      4.19,
      3.49,
      4.29
    ]
  },
  {
    "id": "bread",
    "category": "Lunch",
    "snap": true,
    "prices": [
      2.49,
      2.29,
      2.79,
      1.99,
      2.89
    ]
  },
  {
    "id": "turkey",
    "category": "Lunch",
    "snap": true,
    "prices": [
      3.99,
      3.79,
      4.29,
      3.49,
      4.49
    ]
  },
  {
    "id": "bologna",
    "category": "Lunch",
    "snap": true,
    "prices": [
      2.49,
      2.29,
      2.69,
      2.19,
      2.79
    ]
  },
  {
    "id": "cheese_slices",
    "category": "Lunch",
    "snap": true,
    "prices": [
      2.99,
      2.79,
      3.19,
      2.69,
      3.29
    ]
  },
  {
    "id": "tuna",
    "category": "Lunch",
    "snap": true,
    "prices": [
      1.29,
      1.19,
      1.39,
      1.09,
      1.49
    ]
  },
  {
    "id": "mayo",
    "category": "Lunch",
    "snap": true,
    "prices": [
      3.99,
      3.69,
      4.19,
      3.49,
      4.39
    ]
  },
  {
    "id": "tortillas",
    "category": "Lunch",
    "snap": true,
    "prices": [
      2.49,
      2.29,
      2.69,
      2.19,
      2.79
    ]
  },
  {
    "id": "pb",
    "category": "Lunch",
    "snap": true,
    "prices": [
      2.79,
      2.49,
      2.99,
      2.59,
      3.19
    ]
  },
  {
    "id": "jelly",
    "category": "Lunch",
    "snap": true,
    "prices": [
      2.29,
      2.09,
      2.49,
      1.99,
      2.59
    ]
  },
  {
    "id": "ramen",
    "category": "Lunch",
    "snap": true,
    "prices": [
      1.99,
      1.79,
      2.19,
      1.69,
      2.29
    ]
  },
  {
    "id": "soup",
    "category": "Lunch",
    "snap": true,
    "prices": [
      1.49,
      1.39,
      1.59,
      1.29,
      1.69
    ]
  },
  {
    "id": "chicken",
    "category": "Dinner",
    "snap": true,
    "prices": [
      7.49,
      6.99,
      7.99,
      6.49,
      8.29
    ]
  },
  {
    "id": "beef",
    "category": "Dinner",
    "snap": true,
    "prices": [
      5.49,
      4.99,
      5.79,
      4.89,
      5.99
    ]
  },
  {
    "id": "sausage",
    "category": "Dinner",
    "snap": true,
    "prices": [
      3.99,
      3.79,
      4.29,
      3.49,
      4.49
    ]
  },
  {
    "id": "pork_chops",
    "category": "Dinner",
    "snap": true,
    "prices": [
      6.99,
      6.49,
      7.29,
      5.99,
      null
    ]
  },
  {
    "id": "catfish",
    "category": "Dinner",
    "snap": true,
    "prices": [
      8.99,
      8.49,
      9.49,
      7.99,
      null
    ]
  },
  {
    "id": "shrimp",
    "category": "Dinner",
    "snap": true,
    "prices": [
      7.99,
      7.49,
      8.49,
      6.99,
      null
    ]
  },
  {
    "id": "rice",
    "category": "Dinner",
    "snap": true,
    "prices": [
      4.99,
      4.49,
      5.29,
      4.29,
      5.49
    ]
  },
  {
    "id": "red_beans",
    "category": "Dinner",
    "snap": true,
    "prices": [
      2.99,
      2.69,
      3.19,
      2.59,
      3.29
    ]
  },
  {
    "id": "pinto",
    "category": "Dinner",
    "snap": true,
    "prices": [
      2.79,
      2.49,
      2.99,
      2.39,
      3.19
    ]
  },
  {
    "id": "pasta",
    "category": "Dinner",
    "snap": true,
    "prices": [
      1.29,
      1.19,
      1.39,
      1.09,
      1.49
    ]
  },
  {
    "id": "pasta_sauce",
    "category": "Dinner",
    "snap": true,
    "prices": [
      2.49,
      2.29,
      2.69,
      2.19,
      2.79
    ]
  },
  {
    "id": "mac_cheese",
    "category": "Dinner",
    "snap": true,
    "prices": [
      1.19,
      0.99,
      1.29,
      0.95,
      1.39
    ]
  },
  {
    "id": "cornbread_mix",
    "category": "Dinner",
    "snap": true,
    "prices": [
      0.89,
      0.79,
      0.99,
      0.75,
      1.09
    ]
  },
  {
    "id": "frozen_veg",
    "category": "Dinner",
    "snap": true,
    "prices": [
      1.29,
      1.19,
      1.39,
      1.09,
      1.49
    ]
  },
  {
    "id": "rotisserie",
    "category": "Dinner",
    "snap": false,
    "prices": [
      6.99,
      7.49,
      7.29,
      6.49,
      null
    ]
  },
  {
    "id": "bananas",
    "category": "Produce",
    "snap": true,
    "prices": [
      1.18,
      1.1,
      1.3,
      1.02,
      1.38
    ]
  },
  {
    "id": "apples",
    "category": "Produce",
    "snap": true,
    "prices": [
      4.49,
      3.99,
      4.79,
      3.89,
      4.99
    ]
  },
  {
    "id": "oranges",
    "category": "Produce",
    "snap": true,
    "prices": [
      4.49,
      3.99,
      4.79,
      3.89,
      4.99
    ]
  },
  {
    "id": "onions",
    "category": "Produce",
    "snap": true,
    "prices": [
      2.99,
      2.79,
      3.19,
      2.69,
      3.29
    ]
  },
  {
    "id": "bell_peppers",
    "category": "Produce",
    "snap": true,
    "prices": [
      2.49,
      2.29,
      2.69,
      2.19,
      null
    ]
  },
  {
    "id": "celery",
    "category": "Produce",
    "snap": true,
    "prices": [
      1.79,
      1.59,
      1.99,
      1.49,
      null
    ]
  },
  {
    "id": "potatoes",
    "category": "Produce",
    "snap": true,
    "prices": [
      3.99,
      3.49,
      4.29,
      3.29,
      4.49
    ]
  },
  {
    "id": "carrots",
    "category": "Produce",
    "snap": true,
    "prices": [
      1.99,
      1.79,
      2.19,
      1.69,
      2.29
    ]
  },
  {
    "id": "oil",
    "category": "Pantry",
    "snap": true,
    "prices": [
      4.29,
      3.99,
      4.49,
      3.89,
      4.79
    ]
  },
  {
    "id": "tomatoes",
    "category": "Pantry",
    "snap": true,
    "prices": [
      1.09,
      0.99,
      1.19,
      0.95,
      1.29
    ]
  },
  {
    "id": "flour",
    "category": "Pantry",
    "snap": true,
    "prices": [
      3.29,
      2.99,
      3.49,
      2.79,
      3.69
    ]
  },
  {
    "id": "sugar",
    "category": "Pantry",
    "snap": true,
    "prices": [
      3.49,
      3.19,
      3.69,
      2.99,
      3.89
    ]
  },
  {
    "id": "cajun_seasoning",
    "category": "Pantry",
    "snap": true,
    "prices": [
      2.99,
      2.79,
      3.19,
      2.59,
      3.29
    ]
  },
  {
    "id": "juice_boxes",
    "category": "Snacks",
    "snap": true,
    "prices": [
      3.49,
      3.19,
      3.69,
      2.99,
      3.89
    ]
  },
  {
    "id": "granola",
    "category": "Snacks",
    "snap": true,
    "prices": [
      2.99,
      2.79,
      3.19,
      2.69,
      3.29
    ]
  },
  {
    "id": "yogurt",
    "category": "Snacks",
    "snap": true,
    "prices": [
      2.79,
      2.59,
      2.99,
      2.49,
      null
    ]
  },
  {
    "id": "string_cheese",
    "category": "Snacks",
    "snap": true,
    "prices": [
      4.49,
      4.19,
      4.79,
      3.99,
      null
    ]
  },
  {
    "id": "crackers",
    "category": "Snacks",
    "snap": true,
    "prices": [
      2.99,
      2.69,
      3.19,
      2.59,
      3.29
    ]
  },
  {
    "id": "fruit_cups",
    "category": "Snacks",
    "snap": true,
    "prices": [
      2.49,
      2.29,
      2.69,
      2.19,
      2.79
    ]
  },
  {
    "id": "water",
    "category": "Snacks",
    "snap": true,
    "prices": [
      3.99,
      3.49,
      4.29,
      3.29,
      4.49
    ]
  },
  {
    "id": "formula",
    "category": "Baby",
    "snap": true,
    "prices": [
      17.99,
      16.99,
      18.49,
      16.49,
      null
    ]
  },
  {
    "id": "baby_food",
    "category": "Baby",
    "snap": true,
    "prices": [
      3.99,
      3.69,
      4.19,
      3.49,
      null
    ]
  },
  {
    "id": "diapers",
    "category": "Baby",
    "snap": false,
    "prices": [
      9.99,
      9.49,
      10.49,
      8.99,
      10.99
    ]
  },
  {
    "id": "wipes",
    "category": "Baby",
    "snap": false,
    "prices": [
      3.49,
      3.19,
      3.69,
      2.99,
      3.89
    ]
  },
  {
    "id": "paper_towels",
    "category": "Household",
    "snap": false,
    "prices": [
      7.49,
      6.99,
      7.99,
      6.79,
      8.29
    ]
  },
  {
    "id": "toilet_paper",
    "category": "Household",
    "snap": false,
    "prices": [
      8.99,
      8.49,
      9.49,
      7.99,
      9.99
    ]
  },
  {
    "id": "dish_soap",
    "category": "Household",
    "snap": false,
    "prices": [
      2.49,
      2.29,
      2.69,
      2.19,
      2.79
    ]
  },
  {
    "id": "laundry",
    "category": "Household",
    "snap": false,
    "prices": [
      10.99,
      9.99,
      11.49,
      9.49,
      11.99
    ]
  },
  {
    "id": "toothpaste",
    "category": "Household",
    "snap": false,
    "prices": [
      2.99,
      2.79,
      3.19,
      2.69,
      3.29
    ]
  }
];
const expectedCart = [
  {
    "item": "eggs",
    "qty": 1
  },
  {
    "item": "milk",
    "qty": 1
  },
  {
    "item": "grits",
    "qty": 1
  },
  {
    "item": "bread",
    "qty": 2
  },
  {
    "item": "turkey",
    "qty": 1
  },
  {
    "item": "cheese_slices",
    "qty": 1
  },
  {
    "item": "chicken",
    "qty": 1
  },
  {
    "item": "rice",
    "qty": 1
  },
  {
    "item": "red_beans",
    "qty": 1
  },
  {
    "item": "sausage",
    "qty": 1
  },
  {
    "item": "onions",
    "qty": 1
  },
  {
    "item": "bananas",
    "qty": 1
  },
  {
    "item": "juice_boxes",
    "qty": 1
  },
  {
    "item": "diapers",
    "qty": 1
  }
];

describe("Supplied catalog rules", () => {
  it("has exactly the 65 supplied IDs", () => {
    expect(items.map((item) => item.id)).toEqual(expectedCatalog.map((item) => item.id));
    expect(items).toHaveLength(65);
  });
  it.each(expectedCatalog)("preserves the supplied category, SNAP eligibility, and s1..s5 prices for $id", (expected) => {
    const item = items.find((candidate) => candidate.id === expected.id);
    expect(item && { id: item.id, category: item.category, snap: item.snap, prices: item.prices }).toEqual(expected);
  });
  it("loads exactly the 14 supplied usual-cart rows and quantities", () => {
    expect(usualCart).toEqual(expectedCart);
    expect(usualCart).toHaveLength(14);
  });
});

describe("Category search rules", () => {
  const name = (id: string) => items.find((item) => item.id === id)?.name ?? id;
  it("offers the requested category filter order", () => {
    expect(categories).toEqual(["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Produce", "Pantry", "Baby", "Household"]);
  });
  it.each(categories.filter((category) => category !== "All"))("browses every supplied $category item without a query", (category) => {
    expect(searchCatalog("", category, name).map((item) => item.id)).toEqual(expectedCatalog.filter((item) => item.category === category).map((item) => item.id));
  });
  it("intersects search results with the selected category", () => {
    expect(searchCatalog("chicken", "Lunch", name)).toEqual([]);
    expect(searchCatalog("chicken", "Dinner", name).map((item) => item.id)).toEqual(["chicken", "rotisserie"]);
  });
  it("All retains the existing empty-query and six-result search limit", () => {
    expect(searchCatalog("", "All", name)).toEqual([]);
    expect(searchCatalog("oz", "All", name)).toHaveLength(6);
  });
  it.each([["en", en, "milk"], ["es", es, "leche"], ["vi", vi, "sữa"]] as const)("matches current-language item names in %s", (_lang, dictionary, query) => {
    const translatedName = (id: string) => dictionary[`item_${id}` as keyof typeof dictionary];
    expect(searchCatalog(query, "Breakfast", translatedName).map((item) => item.id)).toContain("milk");
  });
});
