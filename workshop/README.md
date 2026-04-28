# Workshop draaiboek — UI bouwen met Claude

**Datum:** donderdag 30 april 2026
**Klant:** AMP Groep
**Doel:** laten zien hoe je goede frontend UI maakt met Claude die het design system volgt.

---

## Kernboodschap

Zonder context geeft Claude generieke Tailwind-output. Met een design system + duidelijke prompts levert Claude productie-klaar werk dat past in het AMP Groep portaal.

Het verschil zit in **drie dingen**:
1. Het design system staat lokaal en wordt automatisch geladen via `CLAUDE.md`
2. Componentklassen zijn 1-op-1 gekoppeld aan Figma
3. De prompt benoemt het doel, niet de implementatie

---

## Setup vooraf (10 min, eenmalig)

1. Zorg dat elke deelnemer Claude Code geïnstalleerd heeft (`npm i -g @anthropic-ai/claude-code` of via de installer)
2. Kloon deze repo naar lokaal: `git clone <url>`
3. Open een terminal in de repo
4. Start Claude: `claude`
5. Open in een browser `index.html` voor visuele referentie

> **Belangrijk:** Claude leest automatisch `.claude/CLAUDE.md`. Dat dwingt het AMP-design system af. Dit hoeft niet handmatig in de prompt.

---

## Tijdsindeling (90 min totaal)

| Tijd | Onderdeel |
|------|-----------|
| 0:00 – 0:10 | **Intro:** waarom design system + Claude (10 min) |
| 0:10 – 0:25 | **Demo:** componenten-overzicht + dashboard tonen (15 min) |
| 0:25 – 0:40 | **Use case 1:** contactformulier (15 min, 5 min toelichting + 10 min bouwen) |
| 0:40 – 1:00 | **Use case 2:** pricing-sectie (20 min) |
| 1:00 – 1:25 | **Use case 3:** customer dashboard (25 min) |
| 1:25 – 1:30 | **Wrap-up + Q&A** (5 min) |

---

## Demo-flow

### Intro (10 min)
- Toon `index.html` — leg uit dat dit de werkomgeving is
- Open `components-overview.html` — laat zien wat er beschikbaar is
- Laat dark mode toggle zien
- Toon kort de Figma-bron in een tweede tab
- Belangrijke punten:
  - "Claude weet niet automatisch hoe AMP eruitziet — daar is een design system voor"
  - "Wij hebben Figma → CSS gespiegeld zodat Claude exact de juiste klassen pakt"
  - "Vergelijk: zonder dit krijg je `bg-blue-500 rounded-md` Tailwind-rommel"

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
✅ **Specifiek:** "Maak een customer dashboard met sidebar (Klanten, Bestellingen, Facturen), topbar met zoekbalk, 4 stat-cards en een tabel met de laatste 5 bestellingen"

❌ **Implementatie-instructie:** "Gebruik flexbox met justify-content"
✅ **Doel-instructie:** "Plaats de 4 stat-cards naast elkaar op desktop, 2x2 op mobiel"

❌ **Iets nieuws bouwen wat al bestaat:** "Maak een knop"
✅ **Bestaande klassen gebruiken:** Claude pakt vanzelf `.amp-btn-primary` als de CLAUDE.md geladen is

---

## Voorbereiding instructeur

- [ ] Test alle drie use cases vooraf in een lege Claude-sessie
- [ ] Zorg dat `index.html` open staat in browser
- [ ] Zorg dat de Figma-bron in tweede tab open staat
- [ ] Bedenk 1-2 vragen om de groep te laten meedenken bij elke use case
- [ ] Backup: `demo-dashboard.html` als referentie van het eindresultaat
