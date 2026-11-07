import { cleanup, render, screen } from "@testing-library/react";
import { useContext } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createStableContext } from "@/context/stable-context";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("Preview context identity", () => {
  it("keeps mounted provider values available to a re-evaluated consumer", async () => {
    const mountedContext = createStableContext<number | null>("reload-test", null);
    vi.resetModules();
    const refreshedModule = await import("@/context/stable-context");
    const refreshedContext = refreshedModule.createStableContext<number | null>("reload-test", null);
    function Consumer() {
      const value = useContext(refreshedContext);
      return <output data-testid="value">{value ?? "missing"}</output>;
    }
    render(<mountedContext.Provider value={42}><Consumer /></mountedContext.Provider>);
    expect(refreshedContext).toBe(mountedContext);
    expect(screen.getByTestId("value")).toHaveTextContent("42");
  });
  it("does not confuse language and shopping contexts", () => {
    expect(createStableContext("separate-language", null)).not.toBe(createStableContext("separate-trip", null));
  });
  it("never caches context identity in the server runtime", () => {
    vi.stubGlobal("window", undefined);
    expect(createStableContext("server-test", null)).not.toBe(createStableContext("server-test", null));
  });
  it("does not change production context creation", () => {
    vi.stubEnv("DEV", false);
    expect(createStableContext("production-test", null)).not.toBe(createStableContext("production-test", null));
  });
});