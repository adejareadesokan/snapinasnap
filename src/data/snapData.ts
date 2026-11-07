export type Store = { id: string; name: string; address: string; lat: number; lng: number; snap: boolean; hours: string };
export type Item = { id: string; name: string; snap: boolean; note?: string; prices: (number | null)[] };
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

export const items: Item[] = [
  { id: "milk", name: "Milk, 1 gallon", snap: true, prices: [3.79, 3.49, 3.99, 3.29, 4.19] },
  { id: "eggs", name: "Eggs, 1 dozen", snap: true, prices: [3.29, 2.99, 3.49, 2.79, 3.69] },
  { id: "bread", name: "Bread, 1 loaf", snap: true, prices: [2.49, 2.29, 2.79, 1.99, 2.89] },
  { id: "rice", name: "Rice, 5 lb", snap: true, prices: [4.99, 4.49, 5.29, 4.29, 5.49] },
  { id: "red_beans", name: "Red beans, 2 lb", snap: true, prices: [2.99, 2.69, 3.19, 2.59, 3.29] },
  { id: "pinto", name: "Pinto beans, 2 lb", snap: true, prices: [2.79, 2.49, 2.99, 2.39, 3.19] },
  { id: "chicken", name: "Chicken thighs, 3 lb", snap: true, prices: [7.49, 6.99, 7.99, 6.49, 8.29] },
  { id: "beef", name: "Ground beef, 1 lb", snap: true, prices: [5.49, 4.99, 5.79, 4.89, 5.99] },
  { id: "sausage", name: "Smoked sausage, 13 oz", snap: true, prices: [3.99, 3.79, 4.29, 3.49, 4.49] },
  { id: "bananas", name: "Bananas, 2 lb", snap: true, prices: [1.18, 1.1, 1.3, 1.02, 1.38] },
  { id: "apples", name: "Apples, 3 lb bag", snap: true, prices: [4.49, 3.99, 4.79, 3.89, 4.99] },
  { id: "onions", name: "Onions, 3 lb", snap: true, prices: [2.99, 2.79, 3.19, 2.69, 3.29] },
  { id: "potatoes", name: "Potatoes, 5 lb", snap: true, prices: [3.99, 3.49, 4.29, 3.29, 4.49] },
  { id: "frozen_veg", name: "Frozen mixed vegetables, 12 oz", snap: true, prices: [1.29, 1.19, 1.39, 1.09, 1.49] },
  { id: "tomatoes", name: "Canned tomatoes, 14 oz", snap: true, prices: [1.09, 0.99, 1.19, 0.95, 1.29] },
  { id: "cereal", name: "Cereal, 12 oz", snap: true, prices: [3.49, 2.99, 3.79, 3.29, 3.99] },
  { id: "pb", name: "Peanut butter, 16 oz", snap: true, prices: [2.79, 2.49, 2.99, 2.59, 3.19] },
  { id: "oil", name: "Cooking oil, 48 oz", snap: true, prices: [4.29, 3.99, 4.49, 3.89, 4.79] },
  { id: "oj", name: "Orange juice, 52 oz", snap: true, prices: [3.99, 3.69, 4.19, 3.49, 4.29] },
  { id: "formula", name: "Baby formula, 12.4 oz", snap: true, prices: [17.99, 16.99, 18.49, 16.49, null] },
  { id: "rotisserie", name: "Hot rotisserie chicken", snap: false, note: "Hot food is not SNAP eligible", prices: [6.99, 7.49, 7.29, 6.49, null] },
  { id: "diapers", name: "Diapers, 30 ct", snap: false, prices: [9.99, 9.49, 10.49, 8.99, 10.99] },
  { id: "paper_towels", name: "Paper towels, 6 rolls", snap: false, prices: [7.49, 6.99, 7.99, 6.79, 8.29] },
  { id: "dish_soap", name: "Dish soap", snap: false, prices: [2.49, 2.29, 2.69, 2.19, 2.79] },
  { id: "toothpaste", name: "Toothpaste", snap: false, prices: [2.99, 2.79, 3.19, 2.69, 3.29] },
];

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
  { item: "milk", qty: 1 }, { item: "eggs", qty: 1 }, { item: "bread", qty: 2 },
  { item: "rice", qty: 1 }, { item: "red_beans", qty: 1 }, { item: "chicken", qty: 1 },
  { item: "sausage", qty: 1 }, { item: "bananas", qty: 1 }, { item: "diapers", qty: 1 },
];

export const zipCoords: Record<string, [number, number]> = {
  "70112": [29.957, -90.077], "70113": [29.943, -90.083], "70114": [29.938, -90.033],
  "70115": [29.924, -90.102], "70116": [29.967, -90.063], "70117": [29.968, -90.033],
  "70118": [29.947, -90.123], "70119": [29.975, -90.087], "70122": [30.008, -90.064],
  "70124": [30.007, -90.11], "70125": [29.952, -90.103], "70126": [30.017, -90.018],
  "70127": [30.028, -89.977], "70128": [30.05, -89.957], "70129": [30.045, -89.89],
  "70130": [29.94, -90.071], "70131": [29.913, -89.993],
};
