# Story 2.4: Respect de la notation mathématique française

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an enseignant de maths,
I want que les corrections respectent la notation mathématique française,
So that elles correspondent aux conventions utilisées en France.

## Acceptance Criteria

1. **Given** un exercice nécessitant des probabilités conditionnelles
   **When** l'extension génère la correction
   **Then** elle utilise P_A(B) au lieu de P(B|A)
   **And** elle respecte toutes les conventions françaises de notation

2. **Given** un exercice avec des notations mathématiques
   **When** l'extension génère la correction
   **Then** elle applique les conventions françaises pour les probabilités, statistiques et mathématiques
   **And** elle maintient la cohérence avec les programmes scolaires français

## Tasks / Subtasks

- [ ] Task 1: Améliorer les prompts IA pour notation française des probabilités conditionnelles (AC: 1)
  - [ ] Subtask 1.1: Modifier le prompt IA pour spécifier explicitement l'utilisation de P_A(B)
  - [ ] Subtask 1.2: Ajouter des exemples de notations françaises dans les prompts
  - [ ] Subtask 1.3: Tester avec des exemples de probabilités conditionnelles

- [ ] Task 2: Étendre aux autres conventions mathématiques françaises (AC: 2)
  - [ ] Subtask 2.1: Identifier les principales conventions françaises (probabilités, statistiques, notation)
  - [ ] Subtask 2.2: Enrichir les prompts avec toutes les conventions françaises
  - [ ] Subtask 2.3: Valider avec des exercices du programme lycée

- [ ] Task 3: Tests de validation des notations générées
  - [ ] Subtask 3.1: Ajouter des tests vérifiant que l'IA génère les bonnes notations
  - [ ] Subtask 3.2: Tests d'intégration avec différents types d'exercices

## Dev Notes

- Relevant architecture patterns and constraints
  - Utilisation de Copilot pour génération IA avec prompts spécialisés français
  - Intégration Python pour vérifications mathématiques avec conventions françaises
  - Architecture modulaire permettant l'ajout de règles de notation

- Source tree components to touch
  - src/correction-generator.ts : Amélioration des prompts pédagogiques pour notation française
  - src/constants.ts : Ajout de constantes pour notations françaises si nécessaire
  - Tests unitaires pour validation des notations générées par l'IA

- Testing standards summary
  - Tests unitaires pour chaque règle de notation
  - Tests d'intégration avec génération IA
  - Tests de validation avec exercices réels du programme lycée
  - Performance : génération <30 secondes même avec conversion notation

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming)
  - Respect de la séparation des responsabilités : génération IA séparée de la validation
  - Utilisation des patterns TypeScript existants
  - Intégration propre avec l'API VS Code

- Detected conflicts or variances (with rationale)
  - Aucune variance détectée - l'ajout de règles de notation s'intègre naturellement dans l'architecture modulaire

### References

- Cite all technical details with source paths and sections, e.g. [Source: docs/<file>.md#Section]
- [Source: _bmad-output/planning-artifacts/prd.md#Functional Requirements - FR8]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2: Génération de Corrections Pédagogiques - Story 2.4]
- [Source: _bmad-output/planning-artifacts/architecture.md#Technologies Clés - IA: Intégration Copilot]

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Debug Log References

### Completion Notes List

- Story créée automatiquement en mode yolo selon les spécifications des epics et PRD
- Analyse exhaustive des artifacts réalisée pour contexte complet
- Règles de notation française identifiées et implémentation planifiée
- Intégration avec architecture existante validée

### File List

- _bmad-output/implementation-artifacts/2-4-respect-de-la-notation-mathematique-francaise.md (ce fichier)