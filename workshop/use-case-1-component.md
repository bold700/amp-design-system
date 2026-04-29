# Use case 1 — Contactformulier (15 min)

**Doel:** laten zien hoe Claude een losse component bouwt met de juiste Vuetify-componenten, zonder dat je hem dat letterlijk hoeft te vertellen.

---

## Prompt om te plakken

```
Maak een nieuwe Vue-component "ContactForm.vue" in src/components/ met een
contactformulier.

Het formulier moet:
- Naam (verplicht)
- E-mail (verplicht, met email-validatie)
- Onderwerp kiezen uit een dropdown (Algemene vraag / Technisch probleem /
  Klacht / Feedback)
- Bericht in een groot tekstvak
- Een checkbox voor "Ik ga akkoord met de algemene voorwaarden"
- Een verstuur-knop

Het formulier zit in een card in het midden van de pagina, met titel
"Neem contact op" en een korte uitleg.

Vervang daarna de inhoud van src/App.vue door <ContactForm /> in een
v-app + v-main, zodat ik het kan zien op http://localhost:5173.
```

---

## Wat je verwacht dat Claude doet

✓ Leest `.claude/CLAUDE.md` automatisch en weet daardoor:
- `<v-form>` met validation rules
- `<v-text-field>` voor naam en email (`type="email"`, `:rules`)
- `<v-select>` voor onderwerp met `:items`
- `<v-textarea>` voor bericht
- `<v-checkbox>` voor akkoord
- `<v-btn color="primary" type="submit">` voor versturen
- `<v-card>` met `<v-card-title>`, `<v-card-text>`, `<v-card-actions>`
- `<v-container>` + `<v-row>` + `<v-col>` voor centreren
- Spacing via `pa-4`, `ma-auto`, `ga-3` etc.

✓ Geen handmatige `<form>`, `<input>`, `<select>`, `<button>` tags
✓ Geen eigen CSS-klassen
✓ Validation via Vuetify rules-array

---

## Verwacht eindresultaat (visueel)

Een gecentreerde `<v-card>` met:
- AMP-blauwe titel (text-h5)
- Korte body-2 uitleg
- 5 form fields met Vuetify outlined-variant inputs, primary focus-state
- Verstuur-knop primary onderaan, full-width via `block` prop

---

## Veelvoorkomende valkuilen om te bespreken

🔴 **Claude voegt zelf JS-validatie toe zonder te vragen** — discussiepunt: Vuetify-rules zijn schoner dan custom JS. Vraag Claude expliciet om "rules"-array te gebruiken.

🔴 **Claude maakt een eigen kleurschema** — zou niet moeten gebeuren. Als wel: prompt opnieuw met "gebruik color='primary' uit het theme, geen hardcoded kleuren".

🔴 **Claude gebruikt `<form>` ipv `<v-form>`** — corrigeer: "wrap in <v-form ref='form'> zodat we Vuetify validation kunnen gebruiken".

---

## Vervolgvraag aan de groep

> "Wat als ik nu wil dat dit formulier ook een datum-veld krijgt voor 'gewenste contactdatum'?"

Goede prompt: "voeg een v-date-picker of v-text-field type='date' toe na het bericht" — Claude pakt dan automatisch een Vuetify datum-component.

---

## Tijdsverdeling

- 2 min — prompt plakken, Claude laten werken
- 3 min — resultaat openen in browser, samen kijken
- 5 min — bespreken wat er goed ging / wat anders kon
- 5 min — één variant proberen op verzoek van de groep
