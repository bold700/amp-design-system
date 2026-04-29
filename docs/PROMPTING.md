# Prompt-gids voor developers

Dit document leert hoe je goede prompts schrijft voor Claude in deze
repo. Doel: zonder UX-achtergrond toch UI's krijgen die er
professioneel uitzien én lekker werken.

> 💡 **Goed nieuws:** `.claude/CLAUDE.md` past al UX-best-practices
> automatisch toe (validation, loading states, lege states, responsive,
> a11y). Een prompt hoeft die dingen meestal niet te benoemen — Claude
> doet ze sowieso. Maar **scherpere prompts geven scherpere output.**

---

## De 4-vragen-checklist (vóór je prompt)

Beantwoord deze vier vragen in één zin elk vóór je iets aan Claude
vraagt. Plak ze als context in je prompt.

| Vraag | Voorbeeld |
|-------|-----------|
| **1. Wie is de gebruiker?** | "Planner contactcenter" / "Klant met bezorging" |
| **2. Welke taak doet hij?** | "Ziet welke bezorgers te laat zijn" |
| **3. Welke data heeft hij nodig?** | "Bezorger-naam, route, ETA, vertraging" |
| **4. Welke acties kan hij doen?** | "Klant informeren via SMS/email/bel" |

Als je één van die vier niet kunt beantwoorden, **eerst dat oplossen
samen met de stakeholder** — niet met Claude.

---

## Prompt-anatomie

```
[Rol/use case in 1 zin]
[Context: wat is er al / waar past dit in?]

[Hoofd-doel: wat moet de gebruiker kunnen?]

Layout: [keuze, of "kies wat past"]
Data: [bestaande data uit X, of nieuwe data nodig]
Acties: [lijst]
[Optioneel: visuele wensen of constraints]
```

---

## Slechte vs goede prompts

### Voorbeeld 1: een formulier

❌ **Slecht:**
> "Maak een contactformulier"

Wat krijg je: een basale form. Mist context over velden, doel,
en target-user.

✅ **Goed:**
> "Als klant wil ik een contactformulier kunnen invullen om een
> bezorgmelding door te geven. Velden: ordernummer (verplicht),
> probleem-type (dropdown: niet ontvangen / beschadigd / verkeerd),
> beschrijving (textarea), contactvoorkeur (radio: bel/email).
> Bouw als view: src/views/CustomerContactView.vue, met de
> submit-actie die een snackbar laat zien."

Verschil: rol gespecificeerd, velden expliciet, context (waarom
contact), output-locatie.

---

### Voorbeeld 2: een dashboard

❌ **Slecht:**
> "Maak een dashboard"

Wat krijg je: generieke 4-stat-card layout, niet aangepast op het
domein.

✅ **Goed:**
> "Als operationeel manager AMP wil ik een dashboard zien met:
> - Vandaag: aantal bezorgers actief, totaal stops, % afgerond
> - Dit moment: aantal vertraagde bezorgers (rood), aantal te
>   bellen klanten (oranje)
> - Trend: grafiek met afgeronde stops vs tijd vandaag
>
> Layout: stat-cards bovenaan, grafiek midden, lijst met
> vertraagde bezorgers onderaan met klik-naar-detail.
> Hergebruik bezorger-data uit src/data/couriers.js."

Verschil: concrete metrics, layout-suggestie, hergebruik bestaande
data.

---

### Voorbeeld 3: een tabel

❌ **Slecht:**
> "Toon de orders in een tabel"

Wat krijg je: een v-data-table met alle velden zonder filtering.

✅ **Goed:**
> "Als finance medewerker wil ik een tabel met openstaande facturen.
> Kolommen: factuurnummer, klant, bedrag, vervaldatum, dagen te laat
> (rood als >0).
> Filters bovenaan: zoek op klant, status (alle/open/te-laat),
> datumbereik.
> Acties per rij: bekijk, herinner.
> Footer met totaalbedrag en aantal."

Verschil: kolommen expliciet, filter-criteria gespecificeerd,
acties duidelijk.

---

## Standaard prompt-templates per type

Kopieer deze, vul de `[brackets]` in, plak in Claude.

### Template: lijst-met-detail-view

```
Bouw een view waarin een [rol] een lijst van [entiteiten] kan zien,
filteren en een detail kan openen.

Lijst-kolommen: [veld1, veld2, veld3]
Filters: [criterium1, criterium2]
Detail toont: [veld4, veld5, ...]
Acties in detail: [actie1, actie2]

Layout: zoals DispatcherView (sidebar lijst + main detail), of een
v-data-table als de lijst breder is dan diep.
Bestand: src/views/[Naam]View.vue
Data: [bestaande in src/data/X.js | nieuw bestand src/data/Y.js]
```

### Template: dashboard

```
Bouw een dashboard voor [rol] met focus op [hoofdmetric].

Stat cards (max 4): [metric1, metric2, ...]
Grafiek: [welk soort: lijn/bar/donut, welke data]
Lijst onderaan: [welke entiteiten, klikbaar naar detail?]

Hergebruik data uit [bron] of genereer nieuwe in src/data/[naam].js.
```

### Template: formulier

```
Bouw een formulier waarmee [rol] een [actie] kan doen.

Velden:
- [veldnaam] ([type: text/email/select/textarea/date/checkbox])
  ([verplicht? eventuele constraints])
- ...

Bij submit: [wat gebeurt er — snackbar, redirect, andere view?]

Bestand: src/views/[Naam]View.vue
```

### Template: detail-actie (modal of inline)

```
Voeg een [actie-naam] toe aan [bestaande view].

Trigger: [knop ergens, of klik op rij]
Type: [v-dialog modal | inline expansion | side-sheet]

In de actie:
- Bevestiging-tekst
- Eventueel input-velden
- Submit-knop met success-snackbar

Destructief? Ja/Nee (bij ja: bevestiging-stap toevoegen)
```

---

## Anti-patterns

### "Maak het mooi"
❌ "Maak het er mooi uitzien"
✅ Specificeer wat "mooi" betekent: ruime spacing, primary kleur op
  CTA's, witte achtergrond met subtiele schaduw, etc. Of vertrouw
  Vuetify defaults — die zijn al mooi.

### "Voeg gewoon X toe"
❌ "Voeg een filter toe"
✅ "Voeg een filter toe die de tabel filtert op status (alle / open
  / gesloten), via v-btn-toggle bovenaan."

### "Maak het responsive"
❌ "Maak het responsive"
✅ Niet nodig om te zeggen — `.claude/CLAUDE.md` dwingt al af dat
  alles mobile-first is met breakpoints. Sla deze instructie over.

### "Met validatie"
❌ "Met validatie"
✅ Niet nodig om te zeggen — guard rails dwingen al af dat verplichte
  velden rules krijgen. Vermeld alleen ALS je specifieke
  validatie-regels wilt: "email moet uniek zijn", "PLZ-formaat 1234AB".

---

## Wat Claude AUTOMATISCH doet

Spaar deze instructies in je prompt — ze worden al toegepast door
`.claude/CLAUDE.md`:

- ✓ Validatie op verplichte velden + email-format
- ✓ Loading states op buttons en data-fetches
- ✓ Empty states bij lege lijsten/filters
- ✓ Error-feedback via snackbar
- ✓ Bevestiging bij destructieve acties
- ✓ Mobile-first responsive layout
- ✓ Focus states op interactive elements
- ✓ Touch-targets minimaal 44px op mobiel
- ✓ Vuetify-componenten (geen Tailwind, geen eigen CSS)
- ✓ AMP brand-kleuren via theme
- ✓ Realistische Nederlandse placeholder-data

---

## Hoe je test of je prompt goed was

Na Claude's output, loop dit lijstje langs:

1. **Werkt de happy path?** → klik door, zie de feature werken
2. **Werkt de error path?** → submit een ongeldig formulier, klik
   verwijderen-knop, filter naar 0 resultaten
3. **Werkt mobiel?** → resize browser naar 375px, scroll
4. **Werkt het op data-niveau?** → met 0 items, met 1, met 100
5. **Past het in de stijl?** → vergelijk met bestaande
   DispatcherView-look

Als één van deze vijf niet werkt: stuur Claude een gerichte
follow-up. ("De empty state ontbreekt — voeg toe.")

---

## Tips voor de workshop

- Plak hele user-story als prompt: "Als [rol] wil ik [doel] zodat
  [waarde]"
- Kort en gericht is beter dan lang en vaag
- Eén feature per prompt; iteratief uitbreiden gaat sneller dan
  alles in één keer
- Als Claude verkeerd interpreteert: zeg "Nee, ik bedoelde X" — niet
  alles opnieuw uitleggen
- Bij twijfel: vraag Claude eerst een mini-plan ("Wat ga je bouwen?
  In één paragraaf.") en check dat voordat hij code maakt
