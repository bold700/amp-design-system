# Use Cases

Dit document beschrijft de bestaande en mogelijke use cases. Elke use
case is een Vue-view in `src/views/` die in de view-registry van
`src/App.vue` staat.

## Patroon

```
"Als <rol> wil ik <doel> zodat <waarde>"

Bouwblokken:
- Welke data?  -> src/data/<usecase>.js
- Welke layout? -> src/views/<Naam>View.vue
- Welke componenten?
  - Hergebruik wat bestaat (CourierCard, OrderListItem)
  - Maak nieuwe als er een herbruikbare primitive ontstaat
```

---

## Geïmplementeerd

### Dispatcher (`DispatcherView.vue`)

> Als planner contactcenter wil ik een live overzicht van mijn 80
> bezorgers met hun routes, zodat ik kan zien wie te laat is en de
> openstaande klanten kan informeren.

**Layout:** map full-bleed + floating panel links (390px)
**Data:** 80 bezorgers met depot, stops, currentLocation, status
**Flows:**
- Filter / sort / search
- Klik bezorger (lijst of map) → drill-down naar zijn orders
- Vertraging-banner + auto-notify card (channel keuze: email/SMS/bellen)
- Inklapbaar panel via unfold-icon

**Componenten:** AppShell, CourierCard, OrderListItem, Leaflet
**Data-helpers:** parseDelay, shiftEta

---

## Voorbeelden van toekomstige use cases (workshop-prompts)

Hieronder staan een paar prompts in de stijl die in deze codebase past.
Plak ze in een Claude-sessie in deze repo en zie wat er gebeurt.

### Callcenter supervisor

> Als supervisor contactcenter wil ik een lijst van openstaande
> klanten die gebeld moeten worden, gesorteerd op urgentie (de
> dichtstbijzijnde nieuwe ETA eerst), met daarin het ordernummer,
> klant, telefoon, oude → nieuwe ETA, en een belknop per rij.

**Verwachte aanpak:**
- Layout: full-page v-data-table (geen map)
- Data: pull pending stops uit alle delayed bezorgers, voeg
  klantnaam + telefoon toe
- Component: nieuwe view `CallCenterView.vue`, eventueel een
  `CallActionDialog.vue`
- Mogelijke kolommen: Klant, Adres, Bezorger, ETA delta, Status,
  Acties (Bel / Markeer gebeld)

### Finance — onbetaalde facturen

> Als finance medewerker wil ik een overzicht van alle openstaande
> facturen zien, met klantnaam, bedrag, vervaldatum, dagen te laat,
> en herinneringen kunnen sturen.

**Verwachte aanpak:**
- Layout: v-data-table met sticky filter-row
- Data: gegenereerde fictieve facturen
- Stats-row bovenaan met totaal openstaand, gemiddelde betaaltermijn

### Fleet maintenance

> Als wagenpark-manager wil ik per voertuig zien wanneer de volgende
> APK is, hoeveel km gereden, en open onderhoudstickets.

**Verwachte aanpak:**
- Layout: stat-cards bovenaan + v-data-table eronder
- Filter op status (over tijd / binnenkort / op orde)
- Drill-down naar voertuig-detail in een v-dialog

### Klant zelfservice

> Als klant wil ik mijn bestelling kunnen volgen op een kaart, met
> verwachte aankomsttijd en mogelijkheid om bezorgmoment te wijzigen.

**Verwachte aanpak:**
- Layout: simpel mobile-first scherm (1 kolom)
- Map met bezorger-positie + klant-locatie
- Statuskaart met huidige fase, ETA, contact-knoppen

---

## Hoe deze prompts werken

1. Open Claude Code in de repo (terminal: `claude`)
2. Plak de prompt
3. Claude leest `.claude/CLAUDE.md` automatisch → kent architectuur,
   componenten en stijl-regels
4. Claude maakt: data file, view file, eventueel nieuwe components,
   en registreert de view in `App.vue`
5. `npm run dev` draait al — pagina ververst automatisch
6. Klik in de menu-drawer (linksboven) → kies de nieuwe view

Als Claude vastloopt: vraag korter "wie is de gebruiker, welke acties,
welke data?" en herstart.
