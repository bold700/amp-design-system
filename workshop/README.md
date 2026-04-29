# Workshop draaiboek — UI bouwen met Claude + Vuetify

**Datum:** donderdag 30 april 2026
**Klant:** AMP Groep
**Doel:** laten zien hoe je goede frontend UI maakt met Claude die Vuetify (Material Design) volgt.

---

## Kernboodschap

Zonder context geeft Claude generieke output (Tailwind, custom CSS). Met een Vue + Vuetify project + duidelijke prompts levert Claude productie-klaar werk dat past in het AMP Groep portaal.

Het verschil zit in **drie dingen**:

1. **Vuetify is de complete UI-laag** — componenten + layout + spacing + theming komen uit één framework
2. `.claude/CLAUDE.md` dwingt af dat alleen Vuetify gebruikt wordt — geen eigen CSS-klassen, geen handgemaakte HTML-controls
3. AMP-branding zit in `src/plugins/vuetify.js` als theme — wijzig 1 hex en alles rebrandt

---

## Setup vooraf (10 min, eenmalig)

### Stap 1 — Repo klonen

```bash
git clone https://github.com/bold700/amp-design-system.git
cd amp-design-system
npm install
```

### Stap 2 — Open in je editor

| Tool | Command |
|------|---------|
| **Cursor** (aanbevolen) | `cursor .` |
| **VS Code** met Claude-extensie | `code .` |
| **Claude Code** (terminal) | `claude` |
| **Zed** | `zed .` |
| **Windsurf** | `windsurf .` |

> Werkt het commando niet? Open je editor, druk `⌘⇧P`, zoek "Shell Command: Install '...' in PATH" en run dat eenmalig.

### Stap 3 — Start de dev-server

```bash
npm run dev
```

De Vite-server draait dan op http://localhost:5173. Pagina ververst automatisch bij wijzigingen.

### Stap 4 — Open je eerste prompt

Open de chat in je editor (bijv. `⌘L` in Cursor) en plak de prompt uit `workshop/use-case-1-component.md`.

> **Belangrijk:** Claude leest automatisch `.claude/CLAUDE.md`. Dat dwingt Vuetify-only af. Hoeft niet handmatig in de prompt.

---

## Tijdsindeling (90 min totaal)

| Tijd | Onderdeel |
|------|-----------|
| 0:00 – 0:10 | **Intro:** waarom Vuetify + Claude (10 min) |
| 0:10 – 0:25 | **Demo:** dispatcher app + live theme switch tonen (15 min) |
| 0:25 – 0:40 | **Use case 1:** contactformulier (15 min) |
| 0:40 – 1:00 | **Use case 2:** pricing-sectie (20 min) |
| 1:00 – 1:25 | **Use case 3:** customer dashboard (25 min) |
| 1:25 – 1:30 | **Wrap-up + Q&A** (5 min) |

---

## Demo-flow

### Intro (10 min)
- Toon de draaiende app op http://localhost:5173 — leg uit dat dit een Vue + Vuetify project is
- Open `src/App.vue` — laat zien dat alle UI-elementen `<v-...>` tags zijn
- Open `src/plugins/vuetify.js` — laat zien dat AMP-kleuren in het theme zitten
- Wijzig live de primary kleur en ververs — alle componenten passen mee
- Belangrijke punten:
  - "Claude weet niet automatisch hoe AMP eruitziet — daar is een design system voor"
  - "Vuetify levert 80+ kant-en-klare componenten met consistente styling"
  - "Vergelijk: zonder dit krijg je `<button class='bg-blue-500 px-4 py-2 rounded'>` Tailwind-rommel"

### Use cases
Werk de drie bestanden af in volgorde:
1. `use-case-1-component.md` — losse component
2. `use-case-2-section.md` — pagina-sectie
3. `use-case-3-screen.md` — volledig scherm

Elk bestand bevat:
- De prompt om te plakken
- Wat je verwacht dat Claude doet
- Veelvoorkomende valkuilen
- Discussiepunten voor de groep

---

## Anti-patterns om te benadrukken

❌ **Vaag:** "Maak een dashboard"
✅ **Specifiek:** "Maak een customer dashboard met v-navigation-drawer (Klanten, Bestellingen, Facturen), v-app-bar met zoekbalk, 4 v-card-stat-cards en v-data-table met de laatste 5 bestellingen"

❌ **Implementatie-instructie:** "Gebruik flexbox met justify-content"
✅ **Doel-instructie:** "Plaats de 4 stat-cards naast elkaar op desktop, 2x2 op mobiel" — Claude pakt dan vanzelf `<v-row>` met `<v-col cols="12" sm="6" md="3">`

❌ **Eigen styling vragen:** "Maak een knop met blauwe achtergrond en witte tekst"
✅ **Theme-token gebruiken:** "Maak een primaire knop" → `<v-btn color="primary">` met de juiste AMP-kleur

---

## Voorbereiding instructeur

- [ ] Test alle drie use cases vooraf in een lege Claude-sessie
- [ ] Zorg dat `npm run dev` draait
- [ ] Open in twee tabs: de app + de Vuetify documentatie (https://vuetifyjs.com/en/components/all/)
- [ ] Bedenk 1-2 vragen om de groep te laten meedenken bij elke use case
- [ ] Backup: de bestaande `src/App.vue` als referentie van Vuetify-patronen
