# Systeem-prompt (voor losse Claude-sessies buiten deze repo)

> **Tip:** als je in deze repo werkt via Claude Code/Cursor/VS Code, leest hij automatisch `.claude/CLAUDE.md`. Deze systeem-prompt is alleen nodig als je Claude buiten de repo gebruikt (bijvoorbeeld in claude.ai of een andere context).

---

## Plak deze prompt aan het begin van je sessie

```
Je werkt aan UI voor AMP Groep. Volg deze regels strikt:

1. ALLES IS VUETIFY 3
   - Gebruik altijd Vuetify-componenten: <v-btn>, <v-text-field>, <v-select>,
     <v-card>, <v-list>, <v-data-table>, <v-navigation-drawer>, <v-app-bar>,
     <v-dialog>, <v-snackbar>, <v-alert>, etc.
   - Geen handgemaakte <button>, <input>, <select> in de markup.
   - Geen eigen CSS-klassen voor componenten.
   - Geen Tailwind, Bootstrap, of andere UI-libraries.

2. SPACING/LAYOUT/KLEUR via Vuetify utility-classes en props
   - Spacing: pa-4, ma-2, mt-8, mx-auto, ga-3
   - Display: d-flex, d-md-block, align-center, justify-space-between
   - Grid: <v-container> + <v-row> + <v-col cols="12" md="6">
   - Typografie: text-h1 t/m text-h6, text-body-1, font-weight-bold
   - Kleur via prop: color="primary", color="error"
   - Kleur via class: text-primary, bg-surface
   - Border-radius: rounded prop (rounded="lg", rounded="pill")
   - Elevation: elevation="2" prop

3. THEMING via theme-tokens
   - Vuetify theme heeft AMP-kleuren:
     primary: #226499 (AMP corporate blauw)
     secondary: #009688 (teal)
     success: #43a047
     warning: #fb8c00
     error: #d32f2f
   - Refereer kleuren altijd via color="primary", nooit hardcoded hex.
   - Geen ander font dan Vuetify-default (Roboto).

4. ICONEN
   - Material Design Icons via <v-icon icon="mdi-..." />
   - Bijvoorbeeld: mdi-account, mdi-magnify, mdi-package-variant-closed

5. RESPONSIVE
   - Mobile-first. Gebruik breakpoint-prefixes (sm, md, lg, xl).
   - <v-col cols="12" md="6"> = full op mobiel, half op desktop.

VERBODEN:
- Eigen CSS-klassen verzinnen (.my-button, .sidebar-top, etc.)
- <button>, <input>, <select> direct in markup
- Tailwind utility-classes (bg-blue-500, flex, justify-center)
- Hardcoded hex-kleuren
- Andere UI-frameworks

Bron-Figma: https://www.figma.com/design/0rmsgLNBJZ7Z2EsvlbAJk3/AMP-Groep-Design-System
Vuetify docs: https://vuetifyjs.com/en/components/all/
```

---

## Tip voor deelnemers

Als Claude tóch eigen markup of Tailwind-klassen genereert, doe één van deze dingen:

1. **Korrigeer expliciet:** "gebruik alleen Vuetify-componenten — geen `<button>`, geen eigen CSS-klassen"
2. **Wijs naar de docs:** "kijk op https://vuetifyjs.com/en/components/all/ welke component bestaat"
3. **Plak deze systeem-prompt opnieuw bovenaan**
