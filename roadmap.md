# AI shopping list

## Preview context crash
- [x] Reproduce missing-provider errors from duplicate context modules after partial preview reload.
- [x] Preserve both context identities during browser development without changing production or storing user values.
- [x] Verify the reproduction, provider isolation tests, and populated Home → Compare → Trip flow.

## Categorized catalog and meal suggestions
- [x] Replace only items and usual cart with the supplied catalog and prices.
- [x] Add translated item names and category search filters without changing existing layout or links.
- [x] Update AI meal-category instructions and exclude current-list suggestions while preserving privacy and quantity rules.
- [x] Test catalog values, filters, meal rules, and the live shopping and AI flows.

## Compact phone layout
- [x] Compact header, telephone footer, and Home controls/list with sticky comparison action.
- [x] Collapse secondary comparison plans and sale sections; compact trip map and nearby stops.
- [x] Verify 390x844 layouts, tap targets, expansion, existing links, and shopping flow without changing AI or business rules.

## AI shopping list

- [x] Connect Lovable Cloud and secure Lovable AI access.
- [x] Add structured catalog-only parse-list function without text storage or app logging.
- [x] Add translated Home input, results, loading, and failure states without altering existing shopping flow.
- [x] Test parsing rules, existing calculations, and the live Home flow.
- [ ] Verify Lovable AI service-side text retention; blocked by missing documented service-side retention controls.