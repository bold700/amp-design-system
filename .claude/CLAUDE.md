# AMP Groep — Vuetify-only project

## VERPLICHT: alles in dit project is Vuetify (Material Design)

Dit is een Vue 3 + Vuetify 3 project. **Schrijf nooit eigen UI-code buiten Vuetify**. Geen custom CSS-klassen voor componenten, geen handgemaakte HTML-controls, geen alternatieve UI-frameworks.

Bron-Figma: https://www.figma.com/design/0rmsgLNBJZ7Z2EsvlbAJk3/AMP-Groep-Design-System
Vuetify docs: https://vuetifyjs.com/en/components/all/

---

## De drie regels

### 1. Componenten = altijd Vuetify

| Wat je nodig hebt | Vuetify-component |
|-------------------|-------------------|
| Knop | `<v-btn>` |
| Tekstinvoer | `<v-text-field>` |
| Tekstvak | `<v-textarea>` |
| Dropdown | `<v-select>`, `<v-autocomplete>`, `<v-combobox>` |
| Checkbox | `<v-checkbox>` |
| Radio | `<v-radio>` / `<v-radio-group>` |
| Toggle | `<v-switch>` |
| Slider | `<v-slider>` / `<v-range-slider>` |
| Datum | `<v-date-picker>` |
| Card | `<v-card>` met `<v-card-title>` / `<v-card-text>` / `<v-card-actions>` |
| Lijst | `<v-list>` met `<v-list-item>` |
| Tabs | `<v-tabs>` / `<v-tab>` / `<v-window>` / `<v-window-item>` |
| Modal | `<v-dialog>` |
| Drawer/sidebar | `<v-navigation-drawer>` |
| Topbar | `<v-app-bar>` of `<v-toolbar>` |
| Footer | `<v-footer>` |
| Layout grid | `<v-container>`, `<v-row>`, `<v-col>` |
| Badge | `<v-badge>` |
| Chip/tag | `<v-chip>` |
| Avatar | `<v-avatar>` |
| Alert | `<v-alert>` |
| Snackbar | `<v-snackbar>` |
| Tooltip | `<v-tooltip>` |
| Loading | `<v-progress-linear>`, `<v-progress-circular>`, `<v-skeleton-loader>` |
| Pagination | `<v-pagination>` |
| Breadcrumbs | `<v-breadcrumbs>` |
| Expansion/FAQ | `<v-expansion-panels>` |
| Tabel | `<v-data-table>` of `<v-data-table-server>` |
| Empty state | `<v-empty-state>` |
| Iconen | `<v-icon icon="mdi-..." />` (Material Design Icons via @mdi/font) |

> Twijfel? Check https://vuetifyjs.com/en/components/all/ — als het niet bestaat in Vuetify, vraag de gebruiker hoe op te lossen voor je eigen markup verzint.

### 2. Spacing, layout, kleur = altijd Vuetify utility-classes en props

| Wat | Hoe |
|-----|-----|
| Padding/margin | `pa-4`, `pa-md-6`, `ma-2`, `mt-8`, `mx-auto`, etc. |
| Display | `d-flex`, `d-block`, `d-none`, `d-md-flex` |
| Flex | `align-center`, `justify-space-between`, `flex-column`, `flex-grow-1` |
| Grid | `<v-container>` + `<v-row>` + `<v-col cols="12" md="6">` |
| Tekstuitlijning | `text-center`, `text-md-left` |
| Typografie | `text-h1`–`text-h6`, `text-body-1`, `text-body-2`, `text-caption`, `font-weight-bold` |
| Kleur | Component-prop: `color="primary"`, `bg-color="surface"` |
| Kleur in tekst/bg | `class="text-primary"`, `class="bg-surface"` |
| Elevation | `elevation="2"` prop, of `class="elevation-2"` (0-24) |
| Border radius | `rounded` / `rounded="lg"` / `rounded="pill"` props |
| Responsive | breakpoint-prefixes: `sm`, `md`, `lg`, `xl` (bv. `pa-md-6`) |

**Geen handmatige `<style>` blocks** voor layout/spacing/kleur. Alleen als laatste redmiddel — en altijd via theme-tokens, niet hardcoded hex.

### 3. Theming = altijd via `src/plugins/vuetify.js`

Alle kleuren komen uit het Vuetify theme-object. Refereer ze in templates via `color="primary"`, niet via hardcoded hex.

```js
// src/plugins/vuetify.js — AMP brand
export const vuetify = createVuetify({
  theme: {
    defaultTheme: "amp",
    themes: {
      amp: {
        dark: false,
        colors: {
          primary: "#226499",     // AMP corporate blauw (Figma-bron)
          secondary: "#009688",   // Teal
          success: "#43a047",
          warning: "#fb8c00",
          error: "#d32f2f",
          info: "#226499",
          surface: "#ffffff",
          background: "#f5f5f5"
        }
      }
    }
  }
})
```

Een nieuwe kleur nodig? Voeg toe aan dit object, gebruik via `color="..."`.

---

## Verboden (hard nee)

❌ **Eigen CSS-klassen voor componenten** — geen `.my-button`, `.sidebar-top`, `.courier-list`
❌ **Handgemaakte HTML-controls** — geen `<button>`, `<input>`, `<select>` direct in markup. Altijd Vuetify equivalent.
❌ **Tailwind utility classes** — geen `bg-blue-500`, `flex justify-center`. Gebruik Vuetify-equivalenten.
❌ **Hardcoded kleuren** — geen `#1e88e5`, `color: red`. Altijd via theme of `color="..."` prop.
❌ **Andere fonts** — Vuetify gebruikt Roboto by default. Niet zelf Manrope/Inter/Segoe UI laden tenzij expliciet gewijzigd in theme.
❌ **Andere UI libraries** — geen Bootstrap, Tailwind, Element Plus, Naive UI, Quasar, etc.
❌ **Custom CSS in `styles.css` voor layout** — `styles.css` bevat alleen html/body reset.

---

## Toegestaan (mits expliciet)

✅ **Custom CSS** alleen voor zaken die Vuetify niet dekt (bijv. een SVG-pad, een unieke achtergrond-illustratie). Gebruik dan altijd Vuetify theme-tokens via `rgb(var(--v-theme-primary))`.

✅ **Component-scoped `<style>`** in een `.vue` bestand voor één-component visuele tweaks die niet via Vuetify-props kunnen. Houd het minimaal.

---

## Workflow bij nieuwe taken

1. Lees deze CLAUDE.md
2. Check de Vuetify-componentenlijst hierboven — kies de juiste primitive
3. Bouw met Vuetify-componenten + utility classes + props
4. Geen custom classes toevoegen, tenzij echt nodig — vraag dan eerst de gebruiker
5. Test responsive via Vuetify breakpoint-prefixes
6. Theme-wijzigingen alleen in `src/plugins/vuetify.js`

---

## Quickstart commando's

```bash
npm install      # eerste keer
npm run dev      # Vite dev-server op http://localhost:5173
npm run build    # productie-build naar dist/
npm run preview  # preview de build
```
