# Use case 1 — Contactformulier (15 min)

**Doel:** laten zien hoe Claude een losse component bouwt met de juiste design system klassen, zonder dat je hem dat letterlijk hoeft te vertellen.

---

## Prompt om te plakken

```
Maak een contactformulier in een nieuwe HTML pagina genaamd "contact.html".

Het formulier moet:
- Naam invoeren (verplicht)
- E-mail invoeren (verplicht, met validatie)
- Onderwerp kiezen uit een dropdown (Algemene vraag / Technisch probleem / Klacht / Feedback)
- Bericht invoeren in een groot tekstvak
- Een checkbox voor "Ik ga akkoord met de algemene voorwaarden"
- Een verstuur-knop

Het formulier zit in een card in het midden van de pagina, met een titel "Neem contact op" en een korte uitleg.
```

---

## Wat je verwacht dat Claude doet

✓ Leest `.claude/CLAUDE.md` automatisch en weet daardoor:
- Manrope laden via Google Fonts
- `amp-tokens.css` en `amp-components.css` linken
- `.amp-input-group`, `.amp-input-label`, `.amp-input` gebruiken
- `.amp-textarea`, `.amp-select`, `.amp-checkbox-wrap`, `.amp-checkbox`
- `.amp-btn-primary` voor versturen
- `.amp-card` als wrapper

✓ Voegt `required` indicatoren toe (`<span class="required">*</span>`)
✓ Gebruikt semantische HTML: `<form>`, `<label for="...">`, `<input id="...">`
✓ Geen Tailwind, geen hardcoded kleuren, geen ander font

---

## Verwacht eindresultaat (visueel)

Een gecentreerde card op een lichte achtergrond, met:
- AMP-blauwe titel "Neem contact op"
- Korte body-large uitleg
- 5 form fields met labels boven, juiste padding, focus-state in primary blauw
- Verstuur-knop primary onderaan, full-width

---

## Veelvoorkomende valkuilen om te bespreken

🔴 **Claude voegt zelf JS-validatie toe zonder te vragen** — discussiepunt: hoe ver mag de scope groeien? Antwoord: scope-creep is een probleem, maar inline `required` + `type="email"` is acceptabel.

🔴 **Claude maakt een eigen kleurschema** — gebeurt zelden met deze CLAUDE.md, maar als het gebeurt: prompt opnieuw met "gebruik alleen de amp-* klassen uit de CLAUDE.md".

🔴 **Claude vergeet een `<label>`** — toegankelijkheid vereist gekoppelde labels. Vraag de groep waarom dit belangrijk is (screenreaders).

---

## Vervolgvraag aan de groep

> "Wat als ik nu wil dat dit formulier ook een datum-veld krijgt voor 'gewenste contactdatum'?"

Vraag deelnemers welke prompt ze zouden geven. Goede prompt: "voeg een datum-veld toe na het bericht" — Claude pakt dan automatisch een styled `<input type="date">` met `.amp-input`.

---

## Tijdsverdeling

- 2 min — prompt plakken, Claude laten werken
- 3 min — resultaat openen in browser, samen kijken
- 5 min — bespreken wat er goed ging / wat anders kon
- 5 min — één variant proberen op verzoek van de groep
