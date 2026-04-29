# Use case 3 — Customer dashboard (25 min)

**Doel:** de moeilijkste use case. Volledig scherm met meerdere zones: navigatie, header, stat-cards, tabel. Hier komt de echte kracht van Vuetify naar voren.

---

## Prompt om te plakken

```
Maak een nieuwe Vue-component "CustomerDashboard.vue" in src/components/
voor AMP Groep.

Layout:
- v-navigation-drawer (permanent, links) met:
  - Logo "AMP Portal" bovenaan
  - v-list met nav-items: Overzicht, Klanten (actief), Bestellingen,
    Facturen, Rapporten, Instellingen — elk met mdi-icoon
  - Onderaan: v-avatar + naam "Jet van Seumeren" + rol "Beheerder"

- v-app-bar bovenaan met:
  - v-text-field als zoekbalk (prepend-inner-icon mdi-magnify)
  - v-btn color="primary" met "+ Nieuwe klant" rechts

- v-main inhoud:
  - v-breadcrumbs (Home / Klanten)
  - Pagina-titel "Klantenoverzicht" + subtitel
  - v-row met 4 v-col, elk een v-card als stat-card:
    - Totaal klanten (1.284, +8.2%, mdi-account-group)
    - Nieuwe deze maand (142, +12.4%, mdi-account-plus)
    - Inactief (37, -3.1%, mdi-account-off)
    - Gem. omzet per klant (€ 1.847, +5.6%, mdi-currency-eur)
  - v-tabs voor "Alle / Actief / Inactief / Nieuw"
  - v-data-table met kolommen Klant, Status, Laatste bestelling,
    Totale omzet, Acties
  - Vul de tabel met 8 fictieve Nederlandse klantnamen
  - v-pagination onderaan

Plaats de component in src/App.vue zodat ik het kan zien.
```

---

## Wat je verwacht dat Claude doet

✓ `<v-app>` > `<v-layout>` als root
✓ `<v-navigation-drawer permanent>` met `<v-list>` en `<v-list-item>` items
✓ `<v-app-bar>` met density="comfortable"
✓ `<v-main>` met `<v-container>` + `<v-row>` + `<v-col cols="12" sm="6" md="3">`
✓ Stat-cards: `<v-card>` met titel, groot getal, sub-text met up/down arrow
✓ `<v-tabs>` + `<v-tab>` met v-model
✓ `<v-data-table>` met `:headers` en `:items` arrays — geen handmatige `<table>`!
✓ `<v-pagination>` onderaan
✓ Op mobile gaat de drawer dicht (Vuetify regelt dat met `mobile-breakpoint`)

---

## Verwacht eindresultaat

Een productie-klaar dashboard. Vergelijk met `src/App.vue` (de dispatcher demo) om te zien dat dezelfde patronen herbruikt worden.

---

## Bespreekpunten

🟢 **Hoeveelheid code** — een dashboard is veel markup (~150 regels Vue). Met Vuetify+CLAUDE.md genereert Claude dit in 1-2 minuten foutloos. Zonder is dit een uur knutselen.

🟢 **Hoe Claude beslist over kolombreedtes** — vraag de groep: hoe weet Claude dat de stat-cards 1/4 van de breedte moeten zijn? Antwoord: `<v-col cols="12" md="3">` — 12/3 op mobiel, 3/12 (kwart) op desktop.

🟢 **Edge cases** — `<v-data-table>` heeft ingebouwde sortering, paginatie, filtering. Vraag: "voeg een zoekbalk toe die de tabel filtert" — Claude pakt vanzelf de `:search` prop.

🔴 **Wat als de groep iets wil dat NIET in Vuetify zit?** — Bijvoorbeeld een grafiek. Vuetify heeft geen chart-component. Goed moment om te bespreken: voor charts heb je apexcharts of chart.js nodig. Dit is een grens van het design system.

---

## Iteraties om te tonen

1. **Filter:** "Voeg een v-text-field zoekbalk boven de tabel met :search prop"
2. **Detail-paneel:** "Maak dat klik op een rij een v-dialog opent met meer details"
3. **Kolom toevoegen:** "Voeg een kolom 'Land' toe met v-chip badges voor Nederland/België/Duitsland"

---

## Tijdsverdeling

- 5 min — prompt plakken, Claude laten werken
- 5 min — resultaat samen bekijken, vergelijken met App.vue
- 5 min — iteratie 1 (zoekbalk filter)
- 5 min — iteratie 2 (klik-detail dialog)
- 5 min — discussie: waar liep Claude tegen grenzen aan?

---

## Afsluitende gedachte

Vraag aan de groep aan het einde:

> "Wat zou er moeten gebeuren als AMP Groep morgen de huiskleur verandert van blauw naar groen?"

Goed antwoord: één wijziging in `src/plugins/vuetify.js` (`primary: "#43a047"`) en de hele applicatie is meteen rebrand. Dat is de business-waarde van Vuetify + CLAUDE.md + Claude.
