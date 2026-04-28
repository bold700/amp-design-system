# Team Vibe Coders Playbook

Dit teammodel zorgt dat frontenders en devs snel, consistent en production-ready leveren op alle use cases.

## Team setup

- **Frontend lead**: bewaakt Figma-consistentie, states, dark/light en componentkeuzes.
- **UI engineer**: bouwt schermen met `amp-*` en Vuetify als fallback.
- **Product engineer**: koppelt interacties, dataflow en validatie.
- **QA buddy**: checkt visueel, responsive gedrag, accessibility en regressies.

## 3-iteratie delivery loop

### Iteratie 1 — Structuur
- Pak een use case uit `workshop/use-case-*.md`.
- Zet pagina-opbouw neer met tokens, shell, spacing en hiërarchie.
- Kies direct: AMP component of Vuetify fallback.

### Iteratie 2 — Interactie
- Werk states uit: leeg, loading, success, error, disabled.
- Voeg dark/light checks toe.
- Controleer iconen, labels, keyboard flow en focus.

### Iteratie 3 — Productie polish
- Run `npm test`.
- Doe visuele smoke test in browser.
- Scherp copy, alignments, en contrast aan.
- Zorg dat elke use case navigeerbaar en demo-klaar is.

## Beslisregels componenten

- **Eerst** AMP design system componenten gebruiken.
- **Alleen bij ontbrekend component**: Vuetify inzetten (date picker, dialog, autocomplete, etc.).
- Houd kleur, typografie en spacing op AMP tokens.

## Definition of Done per use case

- Scherm volgt Figma intent.
- AMP branding klopt in light én dark.
- Geen consolefouten of gebroken iconen.
- Tests groen (`npm test`).
- Pagina is bereikbaar vanaf `index.html` of `use-case-hub.html`.
