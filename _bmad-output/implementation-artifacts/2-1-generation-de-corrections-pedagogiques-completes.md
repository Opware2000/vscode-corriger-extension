# Story 2.1: Génération de corrections pédagogiques complètes

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an enseignant de maths,
I want générer des corrections pédagogiques complètes pour les exercices détectés,
So that j'obtiens des solutions détaillées et pédagogiques.

## Acceptance Criteria

1. Given un exercice détecté sans correction
   When l'extension génère une correction
   Then elle produit une correction complète et pédagogique
   And elle insère les balises \begin{correction} et \end{correction} appropriées

## Tasks / Subtasks

- [ ] Task 1: Intégrer l'API Copilot Chat pour génération de corrections (AC: 1)
  - [ ] Subtask 1.1: Configurer l'accès à l'API Copilot Chat
  - [ ] Subtask 1.2: Créer une fonction de génération de prompt pédagogique
  - [ ] Subtask 1.3: Implémenter l'appel à Copilot avec timeout 30s
- [ ] Task 2: Parser et analyser l'exercice LaTeX (AC: 1)
  - [ ] Subtask 2.1: Extraire le contenu de l'exercice entre \begin{exercice} et \end{exercice}
  - [ ] Subtask 2.2: Analyser la structure (énoncé, questions)
  - [ ] Subtask 2.3: Détecter le niveau pédagogique si indiqué
- [ ] Task 3: Générer et insérer la correction (AC: 1)
  - [ ] Subtask 3.1: Créer le prompt adapté au niveau lycée
  - [ ] Subtask 3.2: Générer la correction via Copilot
  - [ ] Subtask 3.3: Insérer \begin{correction}...\end{correction} après l'exercice
- [ ] Task 4: Gestion d'erreurs et fallback (AC: 1)
  - [ ] Subtask 4.1: Gérer l'indisponibilité de Copilot
  - [ ] Subtask 4.2: Afficher message d'erreur en français
  - [ ] Subtask 4.3: Proposer alternatives ou retry

## Dev Notes

- Relevant architecture patterns and constraints
  - Architecture modulaire avec séparation des responsabilités
  - Utilisation TypeScript pour l'extension VS Code
  - Intégration Copilot Chat pour génération IA
  - Respect des performances : génération <30 secondes
  - Gestion d'erreurs gracieuse avec messages en français

- Source tree components to touch
  - src/extension.ts : Point d'entrée principal, gestion commandes
  - src/latex-parser.ts : Parsing des exercices LaTeX
  - src/copilot-integration.ts : (nouveau) Intégration Copilot Chat
  - src/correction-generator.ts : (nouveau) Génération corrections pédagogiques

- Testing standards summary
  - Tests unitaires avec Mocha
  - Tests d'intégration pour API VS Code
  - Tests E2E avec Playwright pour scénarios complets
  - Couverture de code >80%

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming)
  - Structure standard d'extension VS Code (src/, out/, package.json)
  - Modules séparés par responsabilité
  - Nommage en anglais pour le code, français pour les messages utilisateur

- Detected conflicts or variances (with rationale)
  - Aucun conflit détecté avec l'architecture existante

### References

- Cite all technical details with source paths and sections
  - [Source: _bmad-output/planning-artifacts/epics.md#Epic-2-Génération-de-Corrections-Pédagogiques]
  - [Source: _bmad-output/planning-artifacts/architecture.md#Décisions-Architecturales-de-Base]
  - [Source: _bmad-output/planning-artifacts/prd.md] (fallback pour exigences)

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Debug Log References

### Completion Notes List

### File List