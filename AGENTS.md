<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- SNAP app: the categorized item catalog lives in src/data/items.json and is exported through snapData.ts; other sample data stays in src/data, pricing/route math in src/lib/planner.ts (tested), and UI strings in src/i18n/*.json via useT(). Why: keeps data, rules and translations swappable.
- Catalog search in src/lib/catalog.ts combines category and English/current-language item names; render catalog names through useT().itemName on Home, AI suggestions, and Compare. Why: one catalog and translation source keep browsing and display consistent.
- Never name a route file route.tsx (reserved by TanStack Router); the route screen lives at /trip.
- AI list parsing uses a public POST createServerFn in src/lib/parse-list.functions.ts and server-only AI SDK Responses helpers; the existing src/data catalog is authoritative so AI and search cannot drift.
- Validate AI output and merge explicit quantities through src/lib/parse-list.ts; send current item IDs per request and exclude them from normalized and visible suggestions; keep AI input/results ephemeral and catch errors before shared logging to avoid recording submitted text. Why: suggestion context stays current without storing free-form input.
- Shared Header and Footer own the compact language selector and fixed telephone bar; Shell reserves footer space, and Home separately reserves its fixed comparison action so content is never covered.
- Use accessible Collapsible disclosures for secondary plans, sale sections, and nearby stops; preserve complete details and existing handlers behind each summary row.
- Language and Trip contexts use src/context/stable-context.ts to preserve context identity only in browser development; never cache provider values or use the registry in SSR/production. Why: partial preview reloads must not disconnect mounted providers from refreshed consumers.
