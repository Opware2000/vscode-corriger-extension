# Story 2.2: Adaptation au niveau lycée

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an enseignant de maths,
I want que les corrections soient adaptées au programme français de mathématiques,
So that le contenu utilise le vocabulaire et les notations appropriés.

## Acceptance Criteria

1. Given un exercice de mathématiques
   When l'extension génère la correction
   Then elle produit du code LaTeX valide avec le vocabulaire et les notations du programme français
   And elle respecte les conventions mathématiques françaises (probabilités P_A(B), etc.)

## Tasks / Subtasks

- [x] Task 1: Modifier les prompts Copilot pour adaptation française (AC: 1)
   - [x] Subtask 1.1: Ajouter instructions pour programme français dans generatePedagogicalPrompt
   - [x] Subtask 1.2: Spécifier notations mathématiques françaises (P_A(B) pour probabilités)
   - [x] Subtask 1.3: Inclure vocabulaire spécifique au programme français
   - [x] Subtask 1.4: Demander génération en code LaTeX valide
   - [x] Subtask 1.5: Respect des conventions pédagogiques françaises
- [x] Task 2: Tester l'adaptation sur différents exercices (AC: 1)
   - [x] Subtask 2.1: Générer corrections pour exercices variés
   - [x] Subtask 2.2: Vérifier utilisation correcte des notations françaises
   - [x] Subtask 2.3: Valider vocabulaire approprié

## Dev Notes

- Relevant architecture patterns and constraints
  - Architecture modulaire avec séparation des responsabilités
  - Utilisation TypeScript pour l'extension VS Code
  - Intégration Copilot Chat pour génération IA avec adaptation française
  - Sortie en code LaTeX valide pour intégration dans documents
  - Respect des performances : génération <30 secondes
  - Gestion d'erreurs gracieuse avec messages en français
  - Respect de la notation mathématique française (probabilités conditionnelles P_A(B))

- Source tree components to touch
  - src/correction-generator.ts : (modifié) Modifier generatePedagogicalPrompt pour programme français
  - src/constants.ts : (modifié) Ajouter constantes pour notations françaises

- Testing standards summary
  - Tests unitaires avec Mocha pour adaptation niveau
  - Tests d'intégration pour génération corrections par niveau
  - Tests E2E avec Playwright pour validation contenu adapté
  - Couverture de code >80%

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming)
  - Structure standard d'extension VS Code (src/, out/, package.json)
  - Modules séparés par responsabilité
  - Nommage en anglais pour le code, français pour les messages utilisateur

- Detected conflicts or variances (with rationale)
  - Modification de correction-generator.ts pour prompts français
  - Ajout de constantes dans src/constants.ts pour notations françaises

### References

- Cite all technical details with source paths and sections
  - [Source: _bmad-output/planning-artifacts/epics.md#Story-2.2-Adaptation-au-niveau-lycée]
  - [Source: _bmad-output/planning-artifacts/architecture.md#Décisions-Architecturales-de-Base]
  - [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements]
  - [Source: _bmad-output/implementation-artifacts/2-1-generation-de-corrections-pedagogiques-completes.md] (learnings from previous story)

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Debug Log References

### Completion Notes List

- Analyse complète des exigences d'adaptation niveau lycée
- Extraction des contraintes architecturales pour génération IA
- Identification des composants à modifier : correction-generator.ts, latex-parser.ts
- Définition des tâches d'implémentation avec sous-tâches détaillées
- Inclusion des références aux documents source pour traçabilité
- Implémentation de generatePedagogicalPrompt avec instructions françaises complètes
- Ajout de constantes pour notations et vocabulaire mathématiques français
- Modification de generateCorrection pour utiliser le nouveau prompt pédagogique
- Ajout de configuration personnalisable du prompt pédagogique dans package.json
- Tests unitaires ajoutés pour valider la génération du prompt français et la configuration
- Toutes les sous-tâches terminées avec tests passant

### File List

- package.json (modifié)
- src/correction-generator.ts (modifié)
- src/constants.ts (modifié)
- src/test/extension.test.ts (modifié)

## Change Log

- Création de la story complète pour adaptation au niveau lycée (2026-01-17)
- Implémentation complète des adaptations françaises pour Copilot (2026-01-17)