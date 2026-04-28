# Use case 3 — Customer dashboard (25 min)

**Doel:** de moeilijkste use case. Volledig scherm met meerdere zones: navigatie, header, stat-cards, tabel, charts. Hier komt de echte kracht van een goed design system naar voren.

---

## Prompt om te plakken

```
Maak een customer dashboard "klanten.html" voor AMP Groep.

Layout:
- Linker sidebar met logo "AMP Portal" bovenaan en navigatie-items (Overzicht, Klanten [actief], Bestellingen, Facturen, Rapporten, Instellingen)
- Topbar met zoekbalk en een primary "+ Nieuwe klant" knop rechts
- Main area met:
  - Page header met breadcrumb (Home / Klanten), titel "Klantenoverzicht" en subtitel "Beheer je klantenlijst en zie hun activiteit"
  - 4 stat cards naast elkaar: Totaal klanten (1.284, +8.2%), Nieuwe deze maand (142, +12.4%), Inactief (37, -3.1%), Gem. omzet per klant (€ 1.847, +5.6%)
  - Tabs voor "Alle klanten / Actief / Inactief / Nieuw"
  - Tabel met kolommen Klant (avatar + naam + email), Status, Laatste bestelling, Totale omzet, Acties
  - Vul de tabel met 8 fictieve Nederlandse klantnamen
  - Onderaan een paginatie

Onderin de sidebar: avatar + "Jet van Seumeren" + rol "Beheerder".
```

---

## Wat je verwacht dat Claude doet

✓ `.amp-app-shell` voor het CSS Grid layout
✓ `.amp-sidebar` + `.amp-nav-item.active` voor de actieve pagina
✓ `.amp-topbar` met `.amp-input` als zoekbalk
✓ `.amp-page-header` met `.amp-breadcrumb`, `.amp-page-title`, `.amp-page-subtitle`
✓ `.amp-stat-grid` > 4x `.amp-stat-card` met `.amp-stat-change.up/.down`
✓ `.amp-tabs` > `.amp-tab.active`
✓ Tabel met `.amp-data-table`, badges via `.amp-badge-success-subtle` etc.
✓ `.amp-pagination` onderaan
✓ Op mobile gaat de sidebar weg (responsive grid)

---

## Verwacht eindresultaat

Praktisch identiek aan `demo-dashboard.html` maar met klanten-context in plaats van bestellingen-context. Vergelijk side-by-side om te zien hoe consistent Claude het systeem volgt.

---

## Bespreekpunten

🟢 **Hoeveelheid HTML** — een dashboard is veel code (~200 regels). Met design system genereert Claude dit in 1-2 minuten foutloos. Zonder design system is dit een uur knutselen.

🟢 **Hoe Claude beslist over kolombreedtes** — vraag de groep: hoe weet Claude dat de stat-cards 1/4 van de breedte moeten zijn? Antwoord: `.amp-stat-grid` heeft `grid-template-columns: repeat(4, 1fr)` ingebakken.

🟢 **Edge cases die Claude vergeet** — meestal: empty state als je een filter klikt zonder resultaat. Goede prompt om toe te voegen: "voeg een empty state toe voor als je op een filter klikt zonder resultaat".

🔴 **Wat als de groep iets wil dat NIET in het design system zit?** — Bijvoorbeeld: "voeg een grafiek toe". `.amp-card` werkt prima als wrapper, maar voor de grafiek zelf moet Claude iets verzinnen (SVG sparkline of placeholder). Goed moment om te bespreken: design systems dekken niet alles, je moet weten waar de rand zit.

---

## Iteraties om te tonen

1. **Kolom toevoegen:** "Voeg een kolom 'Land' toe met badges voor Nederland/België/Duitsland"
2. **Filter:** "Voeg een filter-balk boven de tabel met chips voor status"
3. **Detail-paneel:** "Maak dat klik op een rij een rechter zijpaneel opent met meer details" — dit kan tricky worden, goede leermoment

---

## Tijdsverdeling

- 5 min — prompt plakken, Claude laten werken (groot bestand, duurt langer)
- 5 min — resultaat samen bekijken, vergelijken met `demo-dashboard.html`
- 5 min — iteratie 1 (kolom toevoegen)
- 5 min — iteratie 2 (filter-balk)
- 5 min — discussie: waar liep Claude tegen grenzen aan?

---

## Afsluitende gedachte

Vraag aan de groep aan het einde:

> "Wat zou er moeten gebeuren als AMP Groep morgen de huiskleur verandert van blauw naar groen?"

Goede antwoord: één wijziging in `amp-tokens.css` (`--amp-primary`) en alle drie demo's zijn meteen rebrand. Dat is de business-waarde van een design system gecombineerd met Claude.
