import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader, setResponseStatus } from "@tanstack/react-start/server";
import { APICallError, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { normalizeParsedList, parseListSchema, type ParsedList } from "./parse-list";
import { createResponsesCall } from "./ai/responses.server";
import { parseListInstructions } from "./parse-list.server";

const requestSchema = z.object({ text: z.string(), lang: z.enum(["en", "es", "vi"]) }).strict();
type ParseListError = { error: { status: number; message: string | null } };

function failed(status = 500, message: string | null = null): ParseListError {
  setResponseStatus(status);
  return { error: { status, message } };
}

// Public, stateless first-party POST RPC. No database, transcript, console logs,
// SDK telemetry, retries, or logging of SDK errors (which may include the input).
export const parseList = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<ParsedList | ParseListError> => {
    setResponseHeader("Cache-Control", "no-store");
    const parsed = requestSchema.safeParse(data);
    if (!parsed.success || !parsed.data.text.trim()) return failed(400);
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) return failed(401);
    try {
      const { result } = createResponsesCall(
        getRequest(),
        { baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, model: "openai/gpt-6-astra" },
        [{ role: "user", content: parsed.data.text.trim() }],
        parseListInstructions(parsed.data.lang),
      );
      const output = await result.output;
      return normalizeParsedList(output);
    } catch (error) {
      // A malformed object is a recoverable failure, not an unhandled logged error.
      if (NoObjectGeneratedError.isInstance(error)) return failed(422);
      if (APICallError.isInstance(error)) {
        const status = error.statusCode ?? 500;
        let message: string | null = null;
        // Only surface the gateway's safe credit/access remedy; never return
        // request bodies, raw SDK errors, or schema errors that may echo input.
        if ((status === 402 || status === 403) && error.responseBody) {
          try {
            const body: unknown = JSON.parse(error.responseBody);
            const safe = z.object({ message: z.string().optional(), error: z.object({ message: z.string().optional() }).optional() }).safeParse(body);
            if (safe.success) message = safe.data.message ?? safe.data.error?.message ?? null;
          } catch { /* no logging */ }
        }
        return failed(status, message);
      }
      return failed();
    }
  });