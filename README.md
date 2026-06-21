# StructAI BasePlate

AI Copilot for Structural Steel Base Plate Design — AISC LRFD, AISC ASD, and IS 800:2007.

Built for the LTTS Engineering Intelligence Hackathon 2026.

This is a **fully working, self-contained React app**. There is no backend, no API key, and
nothing to configure — all parameter extraction, engineering calculations, design review, and
PDF generation run entirely in the browser.

---

## 1. What's inside

- React 19 + Vite + TypeScript
- Tailwind CSS (premium white-light design system, exact tokens from the spec)
- Framer Motion (every transition: step changes, card hovers, progress bars, staggered fade-ins)
- jsPDF (generates the 21-section PDF design report client-side)
- lucide-react (icons)
- react-router-dom (Landing / Design Tool / Report pages)

A 10-step guided wizard takes a plain-English description of a base plate, extracts engineering
parameters, runs automated structural calculations (bearing, plate thickness, anchor
tension/shear interaction, embedment, weld, stiffener, shear key), generates a rule-based senior
engineer review, and exports a PDF / JSON / plain-text summary.

> Because there's no LLM backend, "AI extraction" and "AI review" are implemented as
> deterministic pattern-matching and rule engines (`src/lib/extraction.ts` and
> `src/lib/designReview.ts`). They follow the same prompts/logic described in the spec, just
> running locally instead of calling an LLM API. You can swap these for real OpenAI calls later —
> see section 5 below.

---

## 2. Run it in VS Code

### Step 1 — Open the project
1. Unzip the project folder (or clone it).
2. Open VS Code → `File > Open Folder...` → select the `structai-baseplate` folder.
3. Open a terminal inside VS Code: `` Ctrl+` `` (or `Terminal > New Terminal`).

### Step 2 — Install dependencies
You need [Node.js](https://nodejs.org) 18+ installed. Check with:
```bash
node -v
npm -v
```
Then install packages:
```bash
npm install
```

### Step 3 — Start the dev server
```bash
npm run dev
```
You'll see something like:
```
  VITE ready in 200 ms
  ➜  Local:   http://localhost:5173/
```
Open that URL in your browser (Cmd/Ctrl+Click it in the VS Code terminal, or paste it into your
browser). The app supports hot-reload — edit any file and the browser updates instantly.

### Step 4 (optional) — Recommended VS Code extensions
For the smoothest experience, install:
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Prettier — Code formatter**

### Step 5 — Build for production
```bash
npm run build
```
This outputs a static site to `dist/`. Preview it locally with:
```bash
npm run preview
```
You can deploy `dist/` to any static host (Vercel, Netlify, GitHub Pages, S3, etc.) — no server
required.

---

## 3. Using the app

1. **Landing page** (`/`) — overview, click "Start New Design".
2. **Design Tool** (`/design`) — the 10-step wizard:
   1. Select design code (AISC LRFD / AISC ASD / IS 800) + project info
   2. Describe the design in plain English (or click an example chip)
   3. Review the AI-extracted JSON parameters
   4. Fill in any missing fields, review auto-assumptions, click "Confirm & Calculate"
   5. Base plate geometry + concrete bearing check
   6. Plate thickness design with formulas
   7. Anchor bolt force check + embedment check
   8. Weld / stiffener / shear key checks
   9. Senior-engineer style design review (safe points / warnings / critical issues)
   10. Final summary table + export (PDF, copy summary, JSON, start a new design)
3. **Report page** (`/report`) — A4-style report preview shell; full export happens from Step 10
   of the Design Tool.

The **unit toggle** (top-right of the Design Tool) switches every label and result between
**SI Metric** (kN / mm / MPa, IS 1367 anchors, IS sections) and **US Customary**
(kips / in / ksi, ASTM F1554 anchors, AISC sections) — switching code in Step 1 automatically
filters the section and anchor dropdowns to the right country's library.

---

## 4. Project structure

```
src/
├── components/
│   ├── ui/          Button, Card, Input, Select, StatusBadge, UtilisationBar,
│   │                 ResultCard, JsonViewer, UnitToggle, BasePlateSketch,
│   │                 LoadingSequence, StepTransition, ...
│   ├── layout/       Navbar, Footer, Sidebar (step nav), ProgressBar
│   └── steps/        Step01...Step10 — one component per wizard step
├── data/
│   ├── sectionLibrary.ts   IS 808 + AISC section tables, steel/concrete grades
│   └── anchorLibrary.ts    IS 1367 + ASTM F1554 anchor grade tables
├── lib/
│   ├── types.ts             Shared TypeScript types
│   ├── unitConversion.ts    SI <-> US conversion helpers
│   ├── extraction.ts        Plain-English -> structured parameters
│   ├── missingData.ts       Missing-field detection + auto-assumptions
│   ├── calculationEngine.ts Core structural calculations (bearing, thickness,
│   │                         anchors, embedment, weld, stiffener, shear key)
│   ├── designReview.ts      Rule-based "senior engineer" review
│   └── pdfReport.ts         21-section PDF report generator (jsPDF)
└── pages/
    ├── Landing.tsx   /
    ├── Design.tsx    /design  (wizard orchestrator)
    └── Report.tsx    /report
```

---

## 5. Wiring up a real LLM (optional)

If you want true natural-language extraction/review (instead of the deterministic local engine),
add a backend call in `src/lib/extraction.ts` (`extractParameters`) and
`src/lib/designReview.ts` (`runDesignReview`). The original spec's prompt templates are good
starting points — send the user's free text plus the active design code, and parse the model's
JSON response into the `ExtractedParams` / `ReviewResult` shapes defined in `src/lib/types.ts`.
Everything downstream (calculation engine, UI, PDF export) already expects exactly those shapes,
so no other code needs to change.

---

## 6. Engineering disclaimer

This tool produces **preliminary design output only**. All results must be reviewed, verified,
and approved by a qualified structural engineer before use in fabrication or construction.
