# AMP Groep Design System

Code-mirror van het Figma-bestand [AMP Groep Design System](https://www.figma.com/design/0rmsgLNBJZ7Z2EsvlbAJk3/AMP-Groep-Design-System), gebouwd voor de Claude UI-workshop op 2026-04-30.

## Wat zit hierin

| Bestand | Doel |
|---------|------|
| `amp-tokens.css` | Alle design tokens (kleuren, spacing, radius, typografie) |
| `amp-components.css` | Alle componentklassen (~25 componenten) |
| `.claude/CLAUDE.md` | Pixel-perfect afdwinging — Claude leest dit automatisch |
| `index.html` | Landing met navigatie naar overzicht/dashboard/workshop |
| `components-overview.html` | Visuele referentie van alle componenten |
| `demo-dashboard.html` | Volledig dashboard als referentie-output |
| `workshop/` | Workshop-draaiboek met 3 use cases |

## Snel starten

```bash
# 1. Open de demo's in je browser
open index.html

# 2. Start een Claude Code-sessie in deze repo
claude
```

Claude leest automatisch `.claude/CLAUDE.md` en gebruikt vanaf dat moment alleen `amp-*` klassen.

## Workshop

Zie [`workshop/README.md`](workshop/README.md) voor het volledige draaiboek met timing, use cases en bespreekpunten.

## Stijlkeuzes

- **Font:** Manrope (Google Fonts, gewicht 400-800)
- **Primary kleur:** `#226499` (AMP corporate blauw, bevestigd via Figma MCP)
- **Component-naming:** Vuetify-conventie omgezet naar `.amp-*` klassen
- **Radius:** Bescheiden (4-8px) zoals Vuetify
- **Elevation:** Material-stijl shadows (4 niveaus)

## Open punt

De exacte hex-codes voor Teal (secondary), Success, Warning, Error en Grey zijn nog niet uit Figma gehaald — Material-defaults zijn als plaatshouder gebruikt. Voor de workshop is dit voldoende. Voor productie: open Foundations-pagina in Figma, kopieer hex-codes naar `amp-tokens.css`.

## Bestand-architectuur

```
amp-design-system/
├── .claude/
│   └── CLAUDE.md
├── amp-tokens.css
├── amp-components.css
├── assets/
│   └── amp-logo.svg
├── index.html
├── components-overview.html
├── demo-dashboard.html
├── workshop/
│   ├── README.md
│   ├── system-prompt.md
│   ├── use-case-1-component.md
│   ├── use-case-2-section.md
│   └── use-case-3-screen.md
└── README.md
```
