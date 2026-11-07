import { describe, expect, it } from "vitest";
import { priceAt, transport, directionsUrl } from "@/lib/planner";
import { stores } from "@/data/snapData";

const home: [number, number] = [29.968, -90.033];
describe("planner rules", () => {
  it("applies deal sale price", () => expect(priceAt("eggs", "s1")).toBe(2.49));
  it("null price means not carried", () => expect(priceAt("formula", "s5")).toBeNull());
  it("bus costs 2 fares per store", () => expect(transport(home, [stores[0]!, stores[1]!], "bus").cost).toBe(5));
  it("walking is free", () => expect(transport(home, [stores[0]!], "walk").cost).toBe(0));
  it("apple uses dirflg r for transit", () => expect(directionsUrl("A B", "bus", true)).toBe("https://maps.apple.com/?daddr=A%20B&dirflg=r"));
});
