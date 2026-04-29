# AMP Groep Design System

Vue 3 + Vuetify 3 project voor de AMP-workshop op 30 april 2026. Doel: laten zien hoe Claude UI bouwt die Vuetify volgt — geen eigen CSS, geen Tailwind, geen handgemaakte controls.

Bron-Figma: [AMP Groep Design System](https://www.figma.com/design/0rmsgLNBJZ7Z2EsvlbAJk3/AMP-Groep-Design-System)
Vuetify docs: https://vuetifyjs.com/en/components/all/

## Wat zit hierin

| Bestand / map | Doel |
|---------------|------|
| `src/App.vue` | Dispatcher demo — Vuetify-only voorbeeld |
| `src/plugins/vuetify.js` | Theme met AMP-kleuren (primary `#226499`) |
| `src/main.js` | Vue + Vuetify bootstrap |
| `src/styles.css` | Minimaal: html/body reset + map-illustratie |
| `.claude/CLAUDE.md` | Vuetify-only enforcement voor elke Claude-sessie |
| `workshop/` | Workshop-draaiboek met 3 use cases |
| `index.html` | Vite entry-point |
| `vite.config.js` | Vite + Vue plugin |
| `package.json` | Dependencies (Vue, Vuetify, MDI iconen, Vite) |

## Snel starten

### 1. Repo klonen

```bash
git clone https://github.com/bold700/amp-design-system.git
cd amp-design-system
npm install
```

### 2. Open in je editor

| Tool | Command |
|------|---------|
| **Cursor** | `cursor .` |
| **VS Code** | `code .` |
| **Claude Code** (terminal) | `claude` |
| **Zed** | `zed .` |
| **Windsurf** | `windsurf .` |

> Werkt het commando niet? Open je editor, druk `⌘⇧P`, zoek "Shell Command: Install '...' in PATH" en run dat eenmalig.

### 3. Start de dev-server

```bash
npm run dev
```

Open http://localhost:5173 — de pagina ververst automatisch bij elke wijziging.

### 4. Start een use case

Open de chat in je editor (bijv. `⌘L` in Cursor) en plak de prompt uit `workshop/use-case-1-component.md` (of 2 / 3). Claude maakt een nieuwe Vue-component met **alleen Vuetify-componenten** — geen eigen CSS-klassen, geen Tailwind, geen handgemaakte HTML-controls.

## NPM scripts

```bash
npm run dev      # Vite dev-server op http://localhost:5173
npm run build    # Productie-build naar dist/
npm run preview  # Preview de build
```

## De Vuetify-only regel

Alles wat in dit project gebouwd wordt is Vuetify. Geen uitzonderingen voor componenten die Vuetify dekt.

- ✅ `<v-btn>`, `<v-text-field>`, `<v-card>`, `<v-data-table>`, etc.
- ✅ Spacing/layout via Vuetify utility classes (`pa-4`, `d-flex`, `<v-col cols="12" md="6">`)
- ✅ Theming via `src/plugins/vuetify.js`
- ❌ Geen `<button>`, `<input>`, `<select>` direct in markup
- ❌ Geen eigen CSS-klassen (`.my-button`, `.sidebar-row`)
- ❌ Geen Tailwind, Bootstrap, of andere UI-libraries
- ❌ Geen hardcoded hex-kleuren

De volledige regels staan in `.claude/CLAUDE.md` en worden automatisch geladen door Claude Code, Cursor, en VS Code.

## Workshop

Zie [`workshop/README.md`](workshop/README.md) voor het volledige draaiboek met timing, use cases en bespreekpunten.

## Open punt

De exacte hex-codes voor Teal (secondary), Success, Warning, Error en Grey zijn nog niet uit Figma getrokken — Material-defaults zijn als plaatshouder gebruikt. Voor de workshop is dit voldoende. Voor productie: open Foundations-pagina in Figma, kopieer hex-codes naar `src/plugins/vuetify.js`.
