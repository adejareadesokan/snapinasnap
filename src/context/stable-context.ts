import { createContext, type Context } from "react";

// Cache only context identity during browser development. Provider values remain
// in React state; neither shopping data nor language preferences are cached here.
type ContextRegistry = Map<string, Context<unknown>>;
type DevelopmentGlobal = typeof globalThis & { __snapDevelopmentContexts?: ContextRegistry };

export function createStableContext<T>(key: string, defaultValue: T): Context<T> {
  if (!import.meta.env.DEV || typeof window === "undefined") return createContext(defaultValue);

  const scope = globalThis as DevelopmentGlobal;
  const registry = scope.__snapDevelopmentContexts ??= new Map();
  const existing = registry.get(key);
  if (existing) return existing as Context<T>;

  const context = createContext(defaultValue);
  registry.set(key, context as Context<unknown>);
  return context;
}