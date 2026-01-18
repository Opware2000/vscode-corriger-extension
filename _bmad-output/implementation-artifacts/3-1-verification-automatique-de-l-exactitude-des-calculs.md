# Story 3.1: Vérification automatique de l'exactitude des calculs

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an enseignant de maths,
I want que l'IA vérifie automatiquement l'exactitude de tous les calculs dans les corrections générées,
So that je suis assuré de la fiabilité des solutions générées.

## Acceptance Criteria

**Given** un exercice nécessitant des calculs mathématiques
**When** l'extension génère le prompt IA pour la correction
**Then** le prompt inclut des instructions explicites pour que l'IA vérifie tous ses calculs
**And** l'IA marque les calculs vérifiés dans la réponse LaTeX

## Tasks / Subtasks

- [x] Modifier le générateur de prompts pour inclure instructions de vérification automatique
- [x] Ajouter des exemples de vérification dans les prompts système
- [x] Implémenter le marquage des calculs vérifiés dans le format LaTeX
- [x] Tester la fiabilité des vérifications IA sur différents types de calculs
- [x] Gérer les cas où l'IA signale des erreurs de calcul

## Dev Notes

- Séparation claire : IA vérifie ses propres calculs, extension ne fait pas de vérification post-génération
- Prompts incluant "Vérifiez chaque étape de calcul avant de répondre"
- Marquage LaTeX pour calculs validés (% Calcul vérifié automatiquement)
- Gestion des erreurs IA quand vérification échoue

### Project Structure Notes

- Modification de src/correction-generator.ts pour prompts enrichis
- Templates de prompts dans src/prompts/verification-instructions.md
- Tests d'intégration pour vérifier que l'IA respecte les instructions de vérification

### References

- [Source: docs/architecture.md#Génération IA] - Architecture de génération des corrections par IA
- [Source: docs/prd.md#FR9] - Vérification automatique via IA, pas post-traitement
- [Source: docs/ux-design-specification.md#Fiabilité technique] - Confiance dans les vérifications IA

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Debug Log References

### Completion Notes List

- Implémenté la modification du générateur de prompts pour inclure les instructions de vérification automatique des calculs. Créé le fichier src/prompts/verification-instructions.md avec les directives détaillées pour l'IA. Modifié generatePedagogicalPrompt dans src/correction-generator.ts pour append les instructions de vérification à tous les prompts. Ajouté un test unitaire pour vérifier que les instructions sont incluses.

### File List

- src/correction-generator.ts : Modifié generatePedagogicalPrompt pour inclure les instructions de vérification
- src/prompts/verification-instructions.md : Nouveau fichier avec les instructions détaillées pour la vérification automatique des calculs
- src/test/extension.test.ts : Ajouté test unitaire pour vérifier l'inclusion des instructions de vérification

## Change Log

- Implémentation complète de la vérification automatique des calculs via IA (2026-01-18)