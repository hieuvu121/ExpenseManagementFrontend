# new_frontend

Migration target for `frontend/`. The **toolchain** here is matched to that
project — the same `tsconfig` / `vite` / `eslint` / `tailwind` / `postcss`
configuration, at the same versions — so components can be ported across
without also having to chase a toolchain diff.

Stack: Vite 6 + React 18 + TypeScript 5.7 + Tailwind 3, with `vite-plugin-svgr`
for `*.svg?react` imports.

## Dependencies

`dependencies` lists only what `src/` actually imports. The runtime libraries
inherited from `frontend/` that nothing here used yet — FullCalendar, ApexCharts,
flatpickr, react-dropzone, react-markdown, react-helmet-async, `@stomp/stompjs` —
have been removed. Re-add one when you port the component that needs it, pinning
the version `frontend/` uses:

```bash
npm install @stomp/stompjs@^7.3.0     # e.g. when the websocket feed lands
```

Charting is **Chart.js**, not ApexCharts. Both were declared, which left the
house library ambiguous.

## Getting started

```bash
npm install
npm run dev
```

The dev server proxies `/app/v1` and `/ws` to the API gateway at
`http://localhost:8080`, mirroring the nginx reverse proxy in the production
image so the app talks to a same-origin path in both. Override the target with
`GATEWAY_URL`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Vite dev server, listening on `0.0.0.0` |
| `npm run build` | Type-check (`tsc -b`) then production build |
| `npm run typecheck` | Type-check only |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the production build |
