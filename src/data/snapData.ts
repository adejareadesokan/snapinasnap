import itemCatalog from "./items.json";

export type Store = { id: string; name: string; address: string; lat: number; lng: number; snap: boolean; hours: string };
export const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Produce", "Pantry", "Baby", "Household"] as const;
export type CategoryFilter = typeof categories[number];
export type Item = { id: string; name: string; category: Exclude<CategoryFilter, "All">; snap: boolean; note?: string; prices: (number | null)[] };
export type Deal = { item: string; store: string; sale_price: number; ends: string };
export type Extra = { id: string; type: string; name: string; address: string; lat: number; lng: number; when: string; note: string };

export const config = {
  gas_cost_per_mile: 0.25,
  transit_fare_one_way: 1.25,
  transit_fare_label: "Sample fare, check RTA for current price",
  walk_cost: 0,
};

export const stores: Store[] = [
  { id: "s1", name: "Bayou Fresh Grocery", address: "2600 St. Claude Ave, New Orleans, LA 70117", lat: 29.9685, lng: -90.04, snap: true, hours: "7 AM–10 PM" },
  { id: "s2", name: "Crescent Value Market", address: "2400 Tulane Ave, New Orleans, LA 70119", lat: 29.964, lng: -90.092, snap: true, hours: "8 AM–9 PM" },
  { id: "s3", name: "Gentilly Family Foods", address: "4300 Gentilly Blvd, New Orleans, LA 70122", lat: 30.005, lng: -90.06, snap: true, hours: "7 AM–9 PM" },
  { id: "s4", name: "Eastside Discount Grocery", address: "6000 Chef Menteur Hwy, New Orleans, LA 70126", lat: 30.015, lng: -90.005, snap: true, hours: "8 AM–8 PM" },
  { id: "s5", name: "Central City Corner Market", address: "1800 Oretha Castle Haley Blvd, New Orleans, LA 70113", lat: 29.94, lng: -90.083, snap: true, hours: "9 AM–9 PM" },
];

export const items: Item[] = itemCatalog.map((item) => {
  const category = categories.find((candidate) => candidate !== "All" && candidate === item.category);
  if (!category || category === "All") throw new Error("Unknown catalog category");
  return { ...item, category };
});

export const deals: Deal[] = [
  { item: "chicken", store: "s3", sale_price: 5.99, ends: "2026-11-12" },
  { item: "eggs", store: "s1", sale_price: 2.49, ends: "2026-11-10" },
  { item: "rice", store: "s2", sale_price: 3.79, ends: "2026-11-13" },
  { item: "apples", store: "s5", sale_price: 3.49, ends: "2026-11-11" },
  { item: "frozen_veg", store: "s3", sale_price: 0.89, ends: "2026-11-12" },
  { item: "pb", store: "s1", sale_price: 1.99, ends: "2026-11-14" },
];

export const extras: Extra[] = [
  { id: "e1", type: "farmers_market", name: "Neighborhood Farmers Market (sample)", address: "St. Claude Ave & Press St, New Orleans, LA 70117", lat: 29.966, lng: -90.045, when: "Sat Nov 7, 8 AM–12 PM", note: "Accepts SNAP/EBT" },
  { id: "e2", type: "clinic", name: "Free Pop-up Health Clinic (sample)", address: "Tulane Ave & S Broad St, New Orleans, LA 70119", lat: 29.9625, lng: -90.087, when: "Sat Nov 7, 10 AM–2 PM", note: "Flu shots and blood pressure checks" },
  { id: "e3", type: "food_fair", name: "Community Food Fair (sample)", address: "Gentilly Blvd & Elysian Fields Ave, New Orleans, LA 70122", lat: 30.002, lng: -90.057, when: "Sun Nov 8, 11 AM–3 PM", note: "Free produce boxes while they last" },
  { id: "e4", type: "benefits_help", name: "Free Benefits Help Day (sample)", address: "Chef Menteur Hwy & Downman Rd, New Orleans, LA 70126", lat: 30.018, lng: -90.012, when: "Tue Nov 10, 9 AM–1 PM", note: "Help with SNAP and WIC questions" },
];

export const usualCart = [
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

export const zipCoords: Record<string, [number, number]> = {
  "70112": [29.957, -90.077], "70113": [29.943, -90.083], "70114": [29.938, -90.033],
  "70115": [29.924, -90.102], "70116": [29.967, -90.063], "70117": [29.968, -90.033],
  "70118": [29.947, -90.123], "70119": [29.975, -90.087], "70122": [30.008, -90.064],
  "70124": [30.007, -90.11], "70125": [29.952, -90.103], "70126": [30.017, -90.018],
  "70127": [30.028, -89.977], "70128": [30.05, -89.957], "70129": [30.045, -89.89],
  "70130": [29.94, -90.071], "70131": [29.913, -89.993],
};
