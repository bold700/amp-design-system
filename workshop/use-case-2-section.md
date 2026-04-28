# Use case 2 — Pricing-sectie (20 min)

**Doel:** laten zien dat Claude een complete pagina-sectie kan bouwen met meerdere componenten die samen een geheel vormen, in de juiste layout.

---

## Prompt om te plakken

```
Maak een pricing-sectie in een nieuwe pagina "pricing.html" voor AMP Groep.

Drie abonnementen naast elkaar:
- Basis — €49 per maand — voor kleine teams (max 5 gebruikers, basis ondersteuning, standaard rapportages)
- Professional — €149 per maand — voor groeiende organisaties (max 25 gebruikers, prioriteits-ondersteuning, geavanceerde rapportages, API toegang) — DIT IS DE UITGELICHTE OPTIE
- Enterprise — op aanvraag — voor grote organisaties (onbeperkt gebruikers, dedicated support, alle features, SSO, custom integraties)

Boven de cards een sectie-header met eyebrow "Tarieven", titel "Kies het pakket dat bij je past" en een korte introtekst.

Onder de cards een rij met klantenlogo's (placeholder grijze blokken) en de tekst "Vertrouwd door 200+ Nederlandse organisaties".
```

---

## Wat je verwacht dat Claude doet

✓ Gebruikt `.amp-section` als wrapper voor max-width en padding
✓ `.amp-eyebrow` + `.amp-block-section-header` voor de header
✓ `.amp-block-pricing` > `.cards` > drie `.amp-pricing-card`
✓ Middelste card krijgt `.featured` class
✓ `.amp-pricing-features` > `.amp-pricing-feature` voor de features per tier
✓ `.amp-btn-primary` of `.amp-btn-outline` per tier
✓ Voor Enterprise: tekst "Op aanvraag" in plaats van prijs

---

## Verwacht eindresultaat

Drie cards naast elkaar:
- Links/rechts: witte card met border, primary tekst voor tier-naam
- Midden (featured): card met dikkere primary border + shadow, eventueel "Aanbevolen" badge
- Onder elke card een CTA-knop
- Mobiel: 1 kolom (auto-stacking via CSS grid uit de design system)

Daaronder logo-rij in 6 kolommen, gecentreerde tekst.

---

## Bespreekpunten

🟡 **De featured card** — waarom is visuele hiërarchie belangrijk in pricing? Ankereffect (mensen kiezen vaker de middelste / aanbevolen optie).

🟡 **CTA-tekst** — bespreek met de groep: "Start nu" vs "Kies Basis" vs "Probeer 14 dagen gratis". Vraag Claude om een variant.

🟡 **Mobiele weergave** — opent de pagina op je telefoon en bekijk hoe het stapelt. Goede oefening: vraag Claude "kan je dit ook testen op 375px?" en zie wat hij teruggeeft.

---

## Variatie-prompts om uit te proberen

1. "Voeg een toggle toe boven de cards voor maandelijks/jaarlijks (bij jaarlijks 20% korting)"
2. "Wissel de Basic en Pro features om een andere balans te krijgen"
3. "Maak een vierde tier 'Free' aan de linkerkant"

Door deze iteratief te doen, zie je hoe Claude blijft binnen het design system.

---

## Tijdsverdeling

- 3 min — prompt plakken, Claude laten werken
- 4 min — resultaat samen bekijken, mobiel/desktop testen
- 5 min — variant 1 proberen
- 5 min — discussie over visuele hiërarchie en hoe Claude die uitvoerde
- 3 min — afronden, naar volgende use case
