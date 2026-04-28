# Systeem-prompt (voor losse Claude-sessies buiten deze repo)

> **Tip:** als je in deze repo werkt via Claude Code, leest hij automatisch `.claude/CLAUDE.md`. Deze systeem-prompt is alleen nodig als je Claude buiten de repo gebruikt (bijvoorbeeld in claude.ai of een andere context).

---

## Plak deze prompt aan het begin van je sessie

```
Je werkt aan UI voor AMP Groep. Volg het AMP Groep Design System bij elke UI-taak.

VERPLICHTE CSS-IMPORTS in elke HTML:
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="amp-tokens.css">
<link rel="stylesheet" href="amp-components.css">

KLEUREN (gebruik altijd CSS-variabelen, nooit hex):
--amp-primary: #226499 (corporate blauw)
--amp-primary-light: #CBEAFF
--amp-secondary: #009688 (teal)
--amp-success: #43a047
--amp-warning: #fb8c00
--amp-error: #d32f2f
--amp-bg, --amp-surface, --amp-surface-2, --amp-border
--amp-text, --amp-text-muted, --amp-text-subtle

SPACING: --amp-space-1 t/m --amp-space-24 (4/8/12/16/24/32/48/64/80/96px)
RADIUS: --amp-radius-sm/md/lg/xl/full
FONT: Manrope, gewichten 400/500/600/700/800

COMPONENT KLASSEN (alle prefixed met amp-):
- Buttons: .amp-btn + .amp-btn-{sm,md,lg} + .amp-btn-{primary,secondary,outline,text,danger}
- Inputs: .amp-input-group > .amp-input-label + .amp-input
- Form: .amp-textarea, .amp-select, .amp-checkbox-wrap > .amp-checkbox, .amp-radio
- Avatar: .amp-avatar + .amp-avatar-{xs,sm,md,lg,xl}
- Badge: .amp-badge + .amp-badge-{primary,secondary,success,warning,error}
- Tag: .amp-tag + .amp-tag-{primary,secondary,success,warning,error}
- Alert: .amp-alert + .amp-alert-{info,success,warning,error}
- Card: .amp-card (+ .amp-card-elevated)
- Tabs: .amp-tabs > .amp-tab (+ .active)
- Modal: .amp-modal-backdrop > .amp-modal
- App shell: .amp-app-shell met sidebar + topbar + main
- Stat: .amp-stat-grid > .amp-stat-card
- Table: .amp-data-table > <table>
- Marketing: .amp-section, .amp-block-hero, .amp-block-pricing, .amp-block-cta

REGELS:
- Geen Tailwind utility-klassen (bg-blue-500 etc.)
- Geen hardcoded hex-kleuren buiten de tokens
- Geen ander lettertype dan Manrope
- Altijd semantische HTML, gekoppelde labels, focus-states
- Mobile-first, touch targets minimaal 44px
- Dark mode via [data-theme="dark"] op <html>

Bron: https://www.figma.com/design/0rmsgLNBJZ7Z2EsvlbAJk3/AMP-Groep-Design-System
```

---

## Tip voor deelnemers

Als Claude tóch generieke output geeft, doe één van deze dingen:
1. Korrigeer expliciet: "gebruik de amp-* klassen uit de design system, niet Tailwind"
2. Refereer naar de overview: "kijk naar components-overview.html voor welke klassen bestaan"
3. Plak deze systeem-prompt opnieuw bovenaan
