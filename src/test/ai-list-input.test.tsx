import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/context/LanguageContext";
import { TripProvider, useTrip } from "@/context/TripContext";
import { AiListInput } from "@/components/snap/AiListInput";

const { readList } = vi.hoisted(() => ({ readList: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: () => readList }));
vi.mock("@/lib/parse-list.functions", () => ({ parseList: vi.fn() }));

function Cart() {
  const { list } = useTrip();
  return <output data-testid="cart">{JSON.stringify(list)}</output>;
}
function mount() {
  return render(<LanguageProvider><TripProvider><AiListInput /><Cart /></TripProvider></LanguageProvider>);
}
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); readList.mockReset(); });
afterEach(cleanup);

describe("AI shopping list flow", () => {
  it("adds explicit matches immediately but waits for suggestion confirmation", async () => {
    readList.mockResolvedValue({ matches: [{ item_id: "milk", qty: 2 }], suggestions: [{ item_id: "rice", reason: "For dinner" }], not_found: ["salmon"] });
    mount();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "2 milk, dinner, salmon" } });
    fireEvent.click(screen.getByRole("button", { name: "Add to my list" }));
    await waitFor(() => expect(JSON.parse(screen.getByTestId("cart").textContent ?? "[]")).toEqual([{ item: "milk", qty: 2 }]));
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(JSON.parse(screen.getByTestId("cart").textContent ?? "[]")).toEqual([{ item: "milk", qty: 2 }, { item: "rice", qty: 1 }]);
  });
  it("prevents repeated submissions while reading a list", async () => {
    let resolve: ((value: unknown) => void) | undefined;
    readList.mockImplementation(() => new Promise((done) => { resolve = done; }));
    mount();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "milk" } });
    fireEvent.click(screen.getByRole("button", { name: "Add to my list" }));
    expect(screen.getByRole("button")).toBeDisabled();
    expect(readList).toHaveBeenCalledTimes(1);
    await act(async () => { resolve?.({ matches: [], suggestions: [], not_found: [] }); });
  });
  it("leaves the cart and input intact after a failed call", async () => {
    readList.mockRejectedValue(new Error("Network unavailable"));
    mount();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "milk" } });
    fireEvent.click(screen.getByRole("button", { name: "Add to my list" }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(JSON.parse(screen.getByTestId("cart").textContent ?? "[]")).toEqual([]);
    expect(screen.getByRole("textbox")).toHaveValue("milk");
    expect(screen.getByRole("button")).toBeEnabled();
  });
  it.each(["en", "es", "vi"] as const)("sends the current %s app language and keeps free-form text out of storage", async (lang) => {
    localStorage.setItem("snap-lang", lang);
    const text = "2 milk, huevos, một ổ bánh mì";
    readList.mockResolvedValue({ matches: [{ item_id: "milk", qty: 2 }], suggestions: [], not_found: [] });
    mount();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: text } });
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(readList).toHaveBeenCalledWith({ data: { text, lang, current_item_ids: [] } }));
    expect(sessionStorage.getItem("snap-trip")).not.toContain(text);
    expect(JSON.stringify(localStorage)).not.toContain(text);
  });
  it("sends existing item IDs and never offers an existing or newly matched item as a suggestion", async () => {
    sessionStorage.setItem("snap-trip", JSON.stringify({ zip: "70117", mode: "car", list: [{ item: "bread", qty: 2 }], plan: null }));
    readList.mockResolvedValue({ matches: [{ item_id: "turkey", qty: 1 }], suggestions: [
      { item_id: "bread", reason: "Lunch" }, { item_id: "turkey", reason: "Lunch" }, { item_id: "cheese_slices", reason: "Lunch" },
    ], not_found: [] });
    mount();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "turkey and something for lunch" } });
    fireEvent.click(screen.getByRole("button", { name: "Add to my list" }));
    await waitFor(() => expect(readList).toHaveBeenCalledWith({ data: { text: "turkey and something for lunch", lang: "en", current_item_ids: ["bread"] } }));
    await waitFor(() => expect(screen.getAllByRole("button", { name: "Add", exact: true })).toHaveLength(1));
    fireEvent.click(screen.getByRole("button", { name: "Add", exact: true }));
    expect(JSON.parse(screen.getByTestId("cart").textContent ?? "[]")).toEqual([{ item: "bread", qty: 2 }, { item: "turkey", qty: 1 }, { item: "cheese_slices", qty: 1 }]);
  });
});