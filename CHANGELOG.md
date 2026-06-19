# Changelog

## [Unreleased] — Design Token Color Refactor

### Summary
Systematic replacement of all hardcoded hex color literals in React UI source files with CSS custom property design tokens. Approximately 400+ individual color replacements across 30+ files. Status colors and Recharts chart colors were intentionally preserved.

---

### Preserved (Intentional) Colors
The following hex values were **not replaced** because they carry semantic meaning:

| Hex | Semantic Role |
|---|---|
| `#297a3a` | Status: success / vigente |
| `#b25000` | Status: warning / proximo_vencer |
| `#e5484d` | Status: danger / vencido |
| `#a6bbd1` | Status: pending / a6bbd1 |
| `#a8a8a8` | Status: neutral / inactive |
| `#0b3558` | Brand deep (Recharts labels) |
| `#476788` | Brand mid (Recharts ticks) |
| `#d4e0ed` | Border strong / SVG ring track |
| `#006bff` | Recharts primary fill |
| `#ffffff` | White text on colored backgrounds (primary buttons, area badges) |

---

### Design Token Mapping

| Old Hex | New Token |
|---|---|
| `#171717`, `#0b3558` | `var(--color-brand)` |
| `#4d4d4d`, `#666666` | `var(--color-text-muted)` |
| `#a8a8a8` (UI, non-status) | `var(--color-text-faint)` |
| `#ffffff` (card bg) | `var(--surface-card)` |
| `#fafafa` | `var(--surface-canvas)` |
| `#f5f5f5`, `#f0f0f0` | `var(--surface-soft)` |
| `#ebebeb`, `#f0f0f0` (border) | `var(--border-default)` |
| `#d4d4d4` (border strong) | `var(--border-strong)` |
| `12px`, `13px` font sizes | `var(--text-body-sm)`, `var(--text-caption)` |
| `11px`, `10px` font sizes | `var(--text-micro)` |
| `6px`, `4px` border-radius | `var(--radius-sm)` |

---

### Changed Files

#### Pages
- **`src/pages/Landing.tsx`** — Features, Stats, Testimonials, CTA, Hero sections; card backgrounds, borders, text colors, hover handlers
- **`src/pages/Settings.tsx`** — All section cards, modal, session list, tabs border, form field error, toggle switch
- **`src/pages/Curriculum.tsx`** — Calendar nav buttons, search icon, tabs bar, stat cards, empty state
- **`src/pages/WorkerDetail.tsx`** — Tab nav pill background, mock history activity color, remaining card/border tokens
- **`src/pages/Reports.tsx`** — Header border, export button
- **`src/pages/Certifications.tsx`** — Table headers, pagination, filter chips, sort controls, export button

#### Components — Curriculum
- **`src/components/curriculum/MeshGrid.tsx`** — Full refactor: sequential course cards, arrow connectors, modal header/body/footer, worker avatar stacks, close button hover
- **`src/components/curriculum/CourseCard.tsx`** — Card bg/border, category label fallback, status config `en_progreso` border, duration/date text colors, course title color

#### Components — Certifications
- **`src/components/certifications/CertTableRow.tsx`** — Fecha obtención text color
- **`src/components/certifications/CertEmptyState.tsx`** — Button colors (status danger preserved)
- **`src/components/certifications/CertDetailDrawer.tsx`** — Primary button text (white preserved)
- **`src/components/certifications/CertTimeline.tsx`** — Status config colors (all intentionally preserved)
- **`src/components/certifications/DaysSparkline.tsx`** — Status colors (all intentionally preserved)

#### Components — Dashboard
- **`src/components/dashboard/AlertsPanel.tsx`** — Status colors (all intentionally preserved)
- **`src/components/dashboard/TopUrgentWorkers.tsx`** — Status colors (all intentionally preserved)
- **`src/components/dashboard/ActivityFeed.tsx`** — Activity config colors (all intentionally preserved)
- **`src/components/dashboard/AreaComplianceCards.tsx`** — Recharts fill colors preserved

#### Components — Workers
- **`src/components/workers/WorkerCard.tsx`** — Status colors (all intentionally preserved)
- **`src/components/workers/FlipWorkerCard.tsx`** — Status colors (all intentionally preserved)
- **`src/components/workers/WorkerFilter.tsx`** — Status color (intentionally preserved)
- **`src/components/workers/WorkerTable.tsx`** — Status color (intentionally preserved)

#### Components — Profile & Reports
- **`src/components/profile/ProfileHeader.tsx`** — Status and brand colors preserved
- **`src/components/reports/PanelBadge.tsx`** — Text, background, border tokens
- **`src/components/reports/PanelHeader.tsx`** — Title and subtitle text tokens, font size tokens
- **`src/components/reports/ChartTooltips.tsx`** — Tooltip background, border, label, value, caption colors

#### Components — Layout & UI
- **`src/components/layout/Sidebar.tsx`** — Mobile close button text color
- **`src/components/ui/Button.tsx`** — White text on primary/danger variants preserved (intentional)

---

### Verification
- `npm run build` — **✓ 0 errors, 0 warnings** (tsc + vite, 3628 modules)
- Manual smoke tests: all pages render correctly in dev server
- Accessibility: contrast ratios maintained — status colors unchanged, text tokens follow WCAG AA ratios defined in CSS variable declarations
