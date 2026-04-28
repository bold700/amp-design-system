# AMP Groep Design System — Bouw altijd pixel-perfect

## VERPLICHT: Gebruik altijd het AMP design system

Bij ELKE UI-taak (HTML, CSS, component, pagina, dashboard, landing page) geldt:

1. **Laad altijd beide CSS-bestanden** als eerste stap, plus Manrope:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="amp-tokens.css">
<link rel="stylesheet" href="amp-components.css">
```

2. **Gebruik bestaande klassen** — nooit opnieuw uitvinden wat al bestaat.

3. **Nooit afwijken van tokens** — geen custom kleuren, spacing, radius of fonts buiten de variabelen hieronder.

---

## Design tokens (CSS-variabelen)

### Kleuren
```
/* Surfaces */
--amp-bg: #ffffff              --amp-surface: #ffffff
--amp-surface-2: #f5f5f5       --amp-surface-3: #eeeeee
--amp-border: #e0e0e0          --amp-border-strong: #bdbdbd

/* Text */
--amp-text: #212121            --amp-text-muted: #616161
--amp-text-subtle: #9e9e9e     --amp-text-on-primary: #ffffff

/* Primary (AMP corporate blue) */
--amp-primary: #226499         --amp-primary-hover: #1a4f7a
--amp-primary-active: #143d5e  --amp-primary-light: #CBEAFF
--amp-primary-muted: #e6f2fa

/* Secondary (Teal) */
--amp-secondary: #009688       --amp-secondary-hover: #00796b
--amp-secondary-light: #b2dfdb

/* Semantic */
--amp-success: #43a047         --amp-success-bg: #e8f5e9
--amp-warning: #fb8c00         --amp-warning-bg: #fff3e0
--amp-error: #d32f2f           --amp-error-bg: #ffebee
--amp-info: #226499            --amp-info-bg: #CBEAFF
```

### Spacing (gebruik altijd deze waarden)
`4px · 8px · 12px · 16px · 24px · 32px · 48px · 64px · 80px · 96px`
Variabelen: `--amp-space-1` t/m `--amp-space-24`

### Border radius (Vuetify-stijl, bescheiden)
`--amp-radius-sm: 4px` · `--amp-radius-md: 6px` · `--amp-radius-lg: 8px` · `--amp-radius-xl: 16px` · `--amp-radius-full: 9999px`

### Elevation (Material-stijl)
`--amp-elevation-1` t/m `--amp-elevation-4` (subtiel naar diep)

### Typografie
Font: `Manrope` (altijd via `--amp-font-family`)
Gewichten: regular(400) · medium(500) · semibold(600) · bold(700) · extrabold(800)

Klassen: `.amp-display` (56px) · `.amp-h1` (40px) · `.amp-h2` (32px) · `.amp-h3` (24px) · `.amp-h4` (20px) · `.amp-body-large` (18px) · `.amp-body` (16px) · `.amp-body-small` (14px) · `.amp-caption` (12px) · `.amp-overline` (11px uppercase)

---

## Component klassen (gebruik exact deze namen)

### Primitives

| Component | Klasse(n) |
|-----------|-----------|
| Button | `.amp-btn` + `.amp-btn-{sm\|md\|lg}` + `.amp-btn-{primary\|secondary\|outline\|text\|danger}` (+ `.amp-btn-block` voor full-width) |
| Tag/Chip | `.amp-tag` (+ `.amp-tag-{primary\|secondary\|success\|warning\|error}`) + `.amp-tag-remove` |
| Input | `.amp-input-group` > `.amp-input-label` + `.amp-input` (+ `.error`) + `.amp-input-hint` |
| Textarea | `.amp-textarea` |
| Select | `.amp-select` (native `<select>` styled) |
| Checkbox | `.amp-checkbox-wrap` > `.amp-checkbox` (+ `.checked`) |
| Radio | `.amp-radio-wrap` > `.amp-radio` (+ `.checked`) |
| Toggle | `.amp-toggle` (+ `.on`, `.disabled`) |
| Avatar | `.amp-avatar` + `.amp-avatar-{xs\|sm\|md\|lg\|xl}` (24/32/40/56/80px) |
| Badge | `.amp-badge` + `.amp-badge-{primary\|secondary\|success\|warning\|error\|neutral}` (+ `-subtle` varianten) |
| Alert | `.amp-alert` + `.amp-alert-{info\|success\|warning\|error}` > `.amp-alert-icon` + `.amp-alert-content` > `.amp-alert-title` + `.amp-alert-body` |
| Card | `.amp-card` (+ `.amp-card-elevated`) > `.amp-card-title` + `.amp-card-subtitle` |
| Divider | `.amp-divider` (+ `.amp-divider-vertical`) |
| Tabs | `.amp-tabs` > `.amp-tab` (+ `.active`) |
| Modal | `.amp-modal-backdrop` > `.amp-modal` > `.amp-modal-title` + `.amp-modal-body` + `.amp-modal-actions` |
| Snackbar | `.amp-snackbar` + `.amp-snackbar-action` |
| Tooltip | `.amp-tooltip-wrap` > trigger + `.amp-tooltip` |
| Skeleton | `.amp-skeleton` + `.amp-skeleton-{line\|line-sm\|circle\|block}` |
| Progress | `.amp-progress` (+ `.amp-progress-{sm\|lg\|success\|warning\|error}`) > `.amp-progress-bar` |
| Pagination | `.amp-pagination` > `.amp-pagination-item` (+ `.active`) |
| Breadcrumb | `.amp-breadcrumb` > `.amp-breadcrumb-item` (+ `.active`) + `.amp-breadcrumb-sep` |
| Expansion | `.amp-expansion-panel` (+ `.open`) > `.amp-expansion-header` + `.amp-expansion-icon` + `.amp-expansion-body` |

### App / Dashboard blocks

| Block | Klasse |
|-------|--------|
| App shell | `.amp-app-shell` (CSS grid: sidebar + topbar + main) |
| Sidebar | `.amp-sidebar` > `.amp-sidebar-brand` + `.amp-nav-item` (+ `.active`) > `.amp-nav-icon` |
| Topbar | `.amp-topbar` + `.amp-topbar-search` + `.amp-topbar-actions` |
| Page header | `.amp-page-header` > `.amp-page-title` + `.amp-page-subtitle` |
| Stat grid | `.amp-stat-grid` > `.amp-stat-card` > `.amp-stat-label` + `.amp-stat-value` + `.amp-stat-change` (+ `.up`, `.down`) |
| Data table | `.amp-data-table` > `<table>` |
| Empty state | `.amp-empty-state` > `.amp-empty-state-icon` + `.amp-empty-state-title` + `.amp-empty-state-body` |

### Marketing blocks

| Block | Klasse |
|-------|--------|
| Section wrapper | `.amp-section` (max-width 1200px) |
| Eyebrow | `.amp-eyebrow` |
| Hero | `.amp-block-hero` > h1 + p + `.ctas` |
| Section header | `.amp-block-section-header` |
| Feature grid | `.amp-block-feature-grid` > `.amp-feature` > `.amp-feature-icon` + h3 + p |
| Stats bar | `.amp-block-stats` > `.stat-value` + `.stat-label` |
| Pricing | `.amp-block-pricing` > `.cards` > `.amp-pricing-card` (+ `.featured`) |
| CTA block | `.amp-block-cta` |
| Footer | `.amp-block-footer` > `.footer-grid` + `.copyright` |
| Logo | `.amp-logo` (+ `.amp-logo-mark`) |

---

## Regels (strikt)

- **Geen custom kleuren** buiten de tokens — nooit `#ff0000` of `color: red`
- **Geen custom spacing** buiten de tokens — nooit `margin: 15px` of `padding: 18px`
- **Geen custom radius** — nooit `border-radius: 5px`, gebruik `--amp-radius-*`
- **Altijd Manrope** — nooit Inter, Roboto of een ander lettertype
- **Geen Tailwind utility-klassen** zoals `bg-blue-500`, `text-gray-700`, etc. Gebruik alleen `.amp-*` klassen of inline styles met CSS-variabelen
- **Dark mode** werkt automatisch via `prefers-color-scheme` en `[data-theme="dark"]` op `<html>`
- De bron van waarheid is het Figma-bestand: https://www.figma.com/design/0rmsgLNBJZ7Z2EsvlbAJk3/AMP-Groep-Design-System

---

## UX/UI kwaliteitsnormen

Pas deze regels toe bij elk component en elke pagina, naast de design tokens.

### Toegankelijkheid (WCAG AA)
- Minimale contrastverhouding tekst op achtergrond: **4.5:1** (body), **3:1** (grote tekst, iconen)
- Elk interactief element heeft een zichtbare **focus state**: `outline` of `box-shadow` in primary-kleur
- Gebruik altijd semantische HTML: `<button>` voor acties, `<a>` voor navigatie, nooit `<div onclick>`
- Formuliervelden hebben altijd een gekoppeld `<label>` via `for`/`id`
- Afbeeldingen krijgen altijd een `alt`-attribuut (leeg `alt=""` bij decoratieve afbeeldingen)
- Touch targets minimaal **44×44px** op mobiel (input min-height is 44px in dit systeem)

### States — elk interactief element heeft alle states
- **Default** — rust
- **Hover** — subtiele achtergrond of kleurverandering (0.15s ease)
- **Focus** — zichtbaar, nooit `outline: none` zonder alternatief
- **Active/pressed** — `transform: scale(0.98)` of kleurverdieping
- **Disabled** — opacity 0.5, cursor not-allowed, niet klikbaar
- **Loading** — `.amp-skeleton` of `.amp-progress`, nooit een lege of bevroren UI

### Feedback & interactie
- Elke destructieve actie vraagt een bevestiging (modal of confirm)
- Formulieren tonen validatiefouten inline via `.amp-input.error` + `.amp-input-hint.error`
- Succesacties tonen een `.amp-snackbar` of `.amp-alert-success`
- Laadtijd >300ms toont altijd een loading indicator
- Lege states gebruiken `.amp-empty-state` met titel, uitleg en CTA

### Responsive
- Mobile-first: ontwerp voor 375px, schaal op naar desktop
- Touch targets minimaal 44×44px
- Geen horizontale scroll op mobiel
- Tabellen worden op mobiel scrollbaar of omgezet naar lijstitems
- Tekst nooit kleiner dan 14px op mobiel

### Typografie & leesbaarheid
- Regelbreedte: maximaal **680px** voor doorlopende tekst
- Line-height: minimaal 1.5 voor bodytekst
- Nooit meer dan 2 font-weights op één pagina combineren (uitzondering: stat-cards mogen extrabold)
- Koppen hebben altijd negatieve letter-spacing (al gedekt in tokens)

### Motion
- Transities: **0.15s ease** voor micro-interacties (hover, focus)
- **0.2s ease** voor states die in/uit gaan (toggle, dropdown)
- **0.3s ease** voor modals, panels, overlays
- Geen animaties op elementen die tekst tonen (vermindert leesbaarheid)
- Respecteer `prefers-reduced-motion`: gebruik `@media (prefers-reduced-motion: reduce)` om animaties uit te zetten

---

## Workflow bij nieuwe taken

1. Lees deze CLAUDE.md volledig
2. Open bij twijfel `components-overview.html` voor visuele referentie
3. Bouw de UI met `.amp-*` klassen
4. Test op 375px en op desktop, in light en dark mode
5. Geen Tailwind, geen custom hex-codes, geen ander font dan Manrope
