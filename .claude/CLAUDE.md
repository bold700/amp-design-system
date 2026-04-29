# AMP Workshop — playbook voor nieuwe use cases

Dit project is een Vue 3 + Vuetify 3 demo voor AMP Groep (workshop op
2026-04-30). Doel: laten zien dat een nieuwe use case in 5-10 minuten
gebouwd kan worden door Claude in een terminal-sessie.

**Bron:** Figma file `0rmsgLNBJZ7Z2EsvlbAJk3` · Vuetify docs:
https://vuetifyjs.com/en/components/all/

---

## Architectuur

```
src/
├── App.vue                      # Dunne shell + view-registry array
├── main.js                      # Vue + Vuetify bootstrap
├── styles.css                   # Minimale reset
├── plugins/
│   └── vuetify.js               # AMP brand theme (primary #226499)
├── components/
│   ├── AppShell.vue             # v-app + v-app-bar + view-selector drawer
│   ├── CourierCard.vue          # Bezorger-card (dispatcher-specifiek)
│   └── OrderListItem.vue        # Stop-rij in detail-panel
├── views/
│   └── DispatcherView.vue       # Dispatcher use case (huidige demo)
└── data/
    └── couriers.js              # 80 bezorgers + helpers parseDelay/shiftEta
```

**Pattern**: `App.vue` houdt een `views` array bij. `<AppShell>` laat
de gebruiker tussen views switchen via een drawer (menu-knop in app-bar).
De actieve view wordt via `<component :is>` gerenderd in de shell.

---

## Een nieuwe use case toevoegen — checklist

Stappen, in volgorde:

### 1. Begrijp de use case
- Wie is de gebruiker? (rol, taak)
- Welke data heeft hij/zij nodig?
- Welke acties moeten mogelijk zijn?
- Past het in een bestaand layout-patroon (lijst/detail, dashboard, formulier, tabel)?

### 2. Maak de data
- Maak `src/data/<usecase>.js`
- Genereer realistische demo-data deterministisch (functie + seed) zodat reload dezelfde data geeft
- Gebruik Nederlandse namen, plaatsen, bedragen voor herkenbaarheid
- Exporteer hoofd-array + eventuele afgeleide stats/groepen
- Bekijk `src/data/couriers.js` als voorbeeld (depot-coords map, deterministische generator, computed stats)

### 3. Maak de view
- Bestand: `src/views/<Naam>View.vue`
- Bovenaan `<script setup>`: imports, refs, computed, watchers
- Template: **geen `<v-app>` of `<v-app-bar>`** — die zit al in `<AppShell>`
- Gebruik Vuetify utility-classes en componenten (zie regels onderaan)
- Hergebruik wat er al is (CourierCard, OrderListItem) als de data-shape past
- Maak waar nodig nieuwe componenten in `src/components/<Naam>.vue`

### 4. Registreer de view
In `src/App.vue` voeg toe aan de `views` array:
```js
import JouwView from "./views/JouwView.vue";
// ...
const views = [
  // bestaande entries...
  {
    id: "jouw-id",
    label: "Korte naam",
    subtitle: "Een-regel beschrijving",
    icon: "mdi-...",   // kies van https://pictogrammers.com/library/mdi/
    component: markRaw(JouwView)
  }
];
```

### 5. Test
- `npm run build` — moet schoon door (geen TypeScript hier dus
  syntax + import-errors zijn de enige struikelblokken)
- `npm run dev` — open localhost:5173, klik op menu-icon, kies de
  nieuwe view

### 6. Commit
- Committen met duidelijke boodschap
- Co-author Claude footer kan blijven

---

## Beschikbare componenten

### Eigen componenten (in src/components/)

| Component | Doel | Props |
|-----------|------|-------|
| `AppShell` | Shell voor v-app + v-app-bar + view-selector drawer | `views` array, `v-model` op view-id |
| `CourierCard` | Bezorger-card in v-list (dispatcher) | `courier` |
| `OrderListItem` | Stop-rij in detail-paneel (dispatcher) | `stop`, `index`, `delayMinutes?`, `notified?` |

### Vuetify componenten (gebruik altijd Vuetify, geen eigen UI)

| Wat je nodig hebt | Vuetify-component |
|-------------------|-------------------|
| Knop | `<v-btn>` |
| Tekstinvoer | `<v-text-field>` |
| Tekstvak | `<v-textarea>` |
| Dropdown | `<v-select>`, `<v-autocomplete>`, `<v-combobox>` |
| Checkbox / radio / toggle | `<v-checkbox>`, `<v-radio>`, `<v-switch>` |
| Slider / datum | `<v-slider>`, `<v-date-picker>` |
| Card | `<v-card>` met `<v-card-title>` / `<v-card-text>` / `<v-card-actions>` |
| Lijst | `<v-list>` + `<v-list-item>` |
| Tabs | `<v-tabs>` / `<v-tab>` / `<v-window>` / `<v-window-item>` |
| Modal | `<v-dialog>` |
| Drawer | `<v-navigation-drawer>` (alleen binnen view, niet voor app-shell — die is al in AppShell) |
| Layout grid | `<v-container>`, `<v-row>`, `<v-col>` |
| Badge / chip | `<v-badge>`, `<v-chip>` |
| Avatar | `<v-avatar>` |
| Alert | `<v-alert>` |
| Snackbar | `<v-snackbar>` (in de view zelf, niet globaal) |
| Tooltip | `<v-tooltip>` |
| Loading | `<v-progress-linear>`, `<v-progress-circular>`, `<v-skeleton-loader>` |
| Pagination / breadcrumbs | `<v-pagination>`, `<v-breadcrumbs>` |
| Expansion / FAQ | `<v-expansion-panels>` |
| Tabel | `<v-data-table>` of `<v-data-table-server>` |
| Empty state | `<v-empty-state>` |
| Icoon | `<v-icon icon="mdi-..." />` (Material Design Icons) |

### Externe libraries (al geïnstalleerd)

- **Leaflet** + `@vue-leaflet/vue-leaflet` — voor kaarten. Zie
  DispatcherView voor het patroon (`<l-map>` + `<l-tile-layer>` +
  `<l-circle-marker>` + `<l-polyline>`). Vergeet niet
  `:use-global-leaflet="false"` en `@ready` met `invalidateSize()`.

---

## Patronen die we al gebruikt hebben

### Lijst → detail drilldown
- Sidebar met v-list + cards
- Klik selecteert via `v-model:selected`
- Detail-view in dezelfde panel: header switcht, body switcht naar detail
- Back-knop ruimt selectie op
- Voorbeeld: `DispatcherView.vue`

### Filter + sort + search
- Drie reactive refs: `searchQuery`, `sortBy`, `<x>Filter`
- `filteredItems = computed(...)`: zoek (defensieve null-check op
  string), filter, dan sort
- v-model bindings op v-text-field + v-selects
- Voorbeeld: `DispatcherView.vue` `filteredCouriers`

### Sticky panel header met inklapbare body
- v-card met `:style="{ bottom: panelExpanded ? '16px' : 'auto' }"`
- Body in `<template v-if="panelExpanded">` zodat hij uit de DOM gaat
- Icoon `mdi-unfold-less-horizontal` ↔ `mdi-unfold-more-horizontal`
- Voorbeeld: `DispatcherView.vue`

### Map met klik-naar-selecteer
- `:options="{ bubblingMouseEvents: false }"` op markers
- `@click="selectFromMap(id)"`
- `selectFromMap` zet selectedIds én scrollt de bijbehorende card
  in beeld via `data-courier-id` attribuut
- `watch` op selected-courier zoomt de map naar zijn bounds
- Voorbeeld: `DispatcherView.vue`

### Notify / actie-flow met snackbar
- Reactive Set voor "al geactioneerd" items
- Channel-keuze via `<v-btn-toggle>`
- Bij send: items verplaatsen naar Set + v-snackbar tonen
- Voorbeeld: `DispatcherView.vue` `sendNotifications()`

---

## Vuetify-only regels (strikt)

❌ **Eigen CSS-klassen voor componenten** — geen `.my-button`, etc.
❌ **Handgemaakte HTML-controls** — geen `<button>`, `<input>`,
   `<select>` direct. Altijd Vuetify equivalent.
❌ **Tailwind utility-classes** — geen `bg-blue-500`, `flex`,
   `justify-center`. Gebruik Vuetify-equivalenten (`bg-primary`,
   `d-flex`, `justify-center`).
❌ **Hardcoded kleuren** — geen `#1e88e5` of `color: red`. Altijd
   via theme of `color="..."` prop.
❌ **Andere fonts** — Vuetify default is Roboto. Niet zelf laden.
❌ **Andere UI libraries** — geen Bootstrap, Tailwind, Element Plus.

✅ **Spacing/layout via utility classes**: `pa-4`, `ma-2`, `d-flex`,
   `align-center`, `justify-space-between`, `flex-grow-1`, `ga-3`
✅ **Grid via `<v-container>` + `<v-row>` + `<v-col cols="12" md="6">`**
✅ **Typografie via `text-h1`...`text-h6`, `text-body-1`,
   `text-caption`, `font-weight-bold`**
✅ **Kleur via prop**: `color="primary"`, `bg-color="surface"`,
   `class="text-error"`
✅ **Border-radius**: `rounded` of `rounded="lg"` / `rounded="pill"`
✅ **Elevation**: `elevation="2"` of `class="elevation-2"` (0-24)
✅ **Responsive**: breakpoint-prefixes `sm` / `md` / `lg` / `xl`
   (bv. `pa-md-6`, `<v-col cols="12" md="6">`)

✅ **Custom CSS in een `<style>` blok** mag alleen voor zaken die
   Vuetify niet heeft (bv. een SVG-pad, kaartmarker-illustratie). Gebruik
   dan altijd theme-tokens via `rgb(var(--v-theme-primary))`.
✅ **Leaflet** voor kaarten. **apexcharts** of **chart.js** voor charts
   (vraag eerst de gebruiker).

---

## Theming

`src/plugins/vuetify.js` — AMP brand theme:
- `primary: #226499` (corporate blauw, bevestigd uit Figma MCP)
- `secondary: #009688` (teal)
- `success: #43a047`
- `warning: #fb8c00`
- `error: #d32f2f`

Dark variant ook geconfigureerd. Refereer kleuren altijd via
`color="..."` prop of `class="text-..."` of CSS variabele
`rgb(var(--v-theme-primary))`. Nooit hardcoded hex.

---

## Quickstart commando's

```bash
npm install      # eerste keer
npm run dev      # Vite dev-server op http://localhost:5173
npm run build    # productie-build naar dist/
npm run preview  # preview de build
```

---

## Voorbeelden van use cases die in de stijl passen

Zie `docs/USE-CASES.md` voor:
- Dispatcher (huidige demo) — referentie
- Voorbeeld-prompts voor toekomstige use cases (callcenter
  supervisor, finance, fleet, etc.)

Als gebruiker een use case stuurt zonder veel detail, vraag dan
één keer kort: wie is de gebruiker, welke acties, welke data?
Niet eindeloos doorvragen — kies het beste patroon en bouw door.
