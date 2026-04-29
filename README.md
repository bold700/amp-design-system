# AMP Groep Design System

Vue 3 + Vuetify 3 project voor de AMP-workshop op donderdag 30 april 2026.
Doel: live demonstreren dat Claude in een terminal-sessie nieuwe use cases
in 5-10 minuten kan bouwen, in de stijl van het AMP design system.

Bron-Figma: [AMP Groep Design System](https://www.figma.com/design/0rmsgLNBJZ7Z2EsvlbAJk3/AMP-Groep-Design-System)
Vuetify docs: https://vuetifyjs.com/en/components/all/

---

## Eenmalig: setup

```bash
git clone https://github.com/bold700/amp-design-system.git
cd amp-design-system
npm install
```

Vereisten: Node.js 18+ en [Claude Code CLI](https://docs.claude.com/en/docs/claude-code) geïnstalleerd
(`npm install -g @anthropic-ai/claude-code`).

---

## Workshop starten — drie stappen

### Stap 1 — open de repo

```bash
cd ~/Documents/GitHub/amp-design-system
```

### Stap 2 — start de dev-server (Terminal-venster #1)

```bash
npm run dev
```

Vite draait nu op http://localhost:5173. Pagina ververst automatisch
bij elke wijziging.

### Stap 3 — start Claude (Terminal-venster #2)

Open een **nieuw Terminal-venster of tab** (`⌘N` of `⌘T`) en navigeer
naar dezelfde repo:

```bash
cd ~/Documents/GitHub/amp-design-system
claude
```

Claude leest automatisch `.claude/CLAUDE.md` met alle architectuur-regels,
beschikbare componenten en UX-richtlijnen.

### Stap 4 — bouw een use case

Plak een use-case-prompt in Claude. Voorbeelden in
[`docs/USE-CASES.md`](docs/USE-CASES.md). Bijvoorbeeld:

> Als supervisor contactcenter wil ik een lijst van openstaande
> klanten die gebeld moeten worden, gesorteerd op urgentie.

Claude maakt:
- Een nieuwe view in `src/views/`
- Eventueel nieuwe data in `src/data/`
- Voegt de view toe aan de registry in `src/App.vue`

Refresh de browser → klik op het menu-icon linksboven → kies de nieuwe
view in de drawer.

---

## Wat zit er in de repo

```
src/
├── App.vue                      # Dunne shell + view-registry array
├── main.js                      # Vue + Vuetify bootstrap
├── styles.css                   # Minimale reset
├── plugins/
│   └── vuetify.js               # AMP brand theme (primary #226499)
├── components/
│   ├── AppShell.vue             # Shared v-app + v-app-bar + drawer
│   ├── CourierCard.vue          # Bezorger-card (dispatcher)
│   └── OrderListItem.vue        # Stop-rij in detail-paneel
├── views/
│   └── DispatcherView.vue       # Huidige demo
└── data/
    └── couriers.js              # 80 bezorgers + helpers

.claude/CLAUDE.md                # Playbook voor Claude (architectuur,
                                 # componenten, UX guard rails,
                                 # nieuwe-use-case checklist)
docs/
├── USE-CASES.md                 # Voorbeeld-prompts voor toekomstige views
└── PROMPTING.md                 # Hoe ontwikkelaars goed prompten
```

---

## NPM scripts

```bash
npm run dev      # Vite dev-server op http://localhost:5173
npm run build    # Productie-build naar dist/
npm run preview  # Preview de build
```

---

## Stijl-regels (afgedwongen door .claude/CLAUDE.md)

Alles wat Claude in deze repo bouwt:
- ✅ Gebruikt **alleen Vuetify-componenten** (`<v-btn>`, `<v-card>`,
  `<v-data-table>`, etc.)
- ✅ Spacing/layout via Vuetify utility classes (`pa-4`, `d-flex`,
  `<v-col cols="12" md="6">`)
- ✅ Theming via `src/plugins/vuetify.js`
- ✅ AMP-kleuren via theme-tokens (geen hardcoded hex)
- ✅ Mobile-first responsive
- ✅ Validation, loading-states, empty-states, error-feedback
  automatisch
- ❌ Geen Tailwind, Bootstrap, of andere UI-libraries
- ❌ Geen eigen CSS-klassen voor componenten
- ❌ Geen handgemaakte `<button>`/`<input>`/`<select>` in markup

Volledige regels en patronen staan in [`.claude/CLAUDE.md`](.claude/CLAUDE.md).

---

## Voor wie deze repo aanpast

- Lees [`.claude/CLAUDE.md`](.claude/CLAUDE.md) voor architectuur en
  componenten-inventaris.
- Volg de checklist "nieuwe use case toevoegen" in dat bestand.
- Bij twijfel over hoe te prompten: zie [`docs/PROMPTING.md`](docs/PROMPTING.md).

## Open punt

De exacte hex-codes voor secondary/success/warning/error/grey zijn nog
niet exact uit Figma getrokken — Material-defaults zijn als plaatshouder
gebruikt. Voor productie: open Foundations-pagina in Figma, kopieer naar
`src/plugins/vuetify.js`.
