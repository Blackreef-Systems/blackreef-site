# Blackreef website

Static, dependency-free website served from the repository root.

## Pages
- `/` — Blackreef homepage and AxiomIQ feature
- `/notes/` — engineering perspectives
- `/sample-report/` — representative synthetic AxiomIQ artifacts

## Local preview
Run `python -m http.server 8000` from the repository root and visit `http://localhost:8000`. Do not open HTML directly via `file://` because root-relative paths require an HTTP server.

## Quality checks
Run `node scripts/check-site.mjs` (Node.js 18+). GitHub Actions runs this check on pull requests and main pushes.

## Release
Development work goes to `rebuild/blackreef-next` and is reviewed via pull request. Confirm hosting configuration, visual QA, accessibility, and external URLs before merging to `main`. Production hosting is not configured by these files.

## Content notes
The AxiomIQ visualization is illustrative and synthetic. It is not connected to vessel telemetry. Public sample outputs are linked to the AxiomIQ GitHub repository. Do not present the system as operationally validated without supporting evidence.
