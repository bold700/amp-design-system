# Use case 2 — Pricing-sectie (20 min)

**Doel:** laten zien dat Claude een complete pagina-sectie bouwt met meerdere Vuetify-componenten in een grid.

---

## Prompt om te plakken

```
Maak een nieuwe Vue-component "PricingSection.vue" in src/components/ voor
AMP Groep.

Drie abonnementen naast elkaar in een v-row + v-col grid:
- Basis — €49 per maand — voor kleine teams (max 5 gebruikers, basis
  ondersteuning, standaard rapportages)
- Professional — €149 per maand — voor groeiende organisaties (max 25
  gebruikers, prioriteits-ondersteuning, geavanceerde rapportages, API
  toegang) — DIT IS DE UITGELICHTE OPTIE (border in primary kleur of
  elevation hoger)
- Enterprise — op aanvraag — voor grote organisaties (onbeperkt gebruikers,
  dedicated support, alle features, SSO, custom integraties)

Boven de cards een sectie-header met:
- Eyebrow text "Tarieven" in primary kleur
- Titel "Kies het pakket dat bij je past"
- Korte introtekst

Onder de cards een rij met klantenlogo's (placeholder v-avatars met
initialen) en de tekst "Vertrouwd door 200+ Nederlandse organisaties".

Plaats de component in src/App.vue zodat ik het kan zien.
```

---

## Wat je verwacht dat Claude doet

✓ `<v-container>` met max-width voor centreren
✓ `<v-row>` + drie `<v-col cols="12" md="4">` voor responsive grid
✓ Drie `<v-card>` met:
- `<v-card-title>` voor tier-naam
- Groot prijs-label via `text-h3` of `text-h2`
- `<v-list>` met `<v-list-item>` voor features (icon `mdi-check`)
- `<v-card-actions>` met `<v-btn>` als CTA
✓ Middelste card heeft `border` of `elevation="8"` of `color="primary-lighten-1"` om uit te springen
✓ `<v-btn>` met `color="primary"` (featured) of `variant="outlined"` (anderen)
✓ Sectie-header gebruikt `text-overline text-primary` voor eyebrow, `text-h3` voor titel
✓ Klantenlogo's via `<v-avatar>` met initialen, in een `<div class="d-flex justify-center ga-4">`

---

## Verwacht eindresultaat

Drie cards naast elkaar:
- Links/rechts: standaard `<v-card>` met `variant="outlined"`
- Midden (featured): `<v-card>` met `color="primary-lighten-1"` of `elevation="8"`, eventueel een `<v-chip color="primary">` "Aanbevolen" badge bovenaan
- Onder elke card een CTA-knop
- Mobiel: 1 kolom (auto-stacking via `cols="12"` zonder breakpoint-suffix)

Daaronder logo-rij in flex-row, gecentreerd.

---

## Bespreekpunten

🟡 **De featured card** — bespreek visuele hiërarchie en waarom de middelste optie meestal "wint" (ankereffect).

🟡 **CTA-tekst** — vraag Claude variaties: "Start nu" vs "Probeer 14 dagen gratis" vs "Kies Basis".

🟡 **Mobiele weergave** — open de pagina op je telefoon. Goede oefening: "kan je dit ook controleren op 375px?" en zie of Claude de breakpoints aanpast.

---

## Variatie-prompts om uit te proberen

1. "Voeg een v-switch toe boven de cards voor maandelijks/jaarlijks (bij jaarlijks 20% korting)"
2. "Wissel de Basis en Pro features om een andere balans te krijgen"
3. "Maak een vierde tier 'Free' aan de linkerkant — pas het grid aan naar 4 kolommen op desktop"

---

## Tijdsverdeling

- 3 min — prompt plakken, Claude laten werken
- 4 min — resultaat samen bekijken, mobiel/desktop testen
- 5 min — variant 1 proberen
- 5 min — discussie over visuele hiërarchie
- 3 min — afronden, naar volgende use case
