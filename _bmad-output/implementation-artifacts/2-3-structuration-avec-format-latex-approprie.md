# Story 2.3: Structuration avec format LaTeX approprié

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an enseignant de maths,
I want que les corrections soient structurées avec numérotation et format LaTeX approprié,
So that elles s'intègrent parfaitement dans le document.

## Acceptance Criteria

1. **Given** une correction générée
   **When** elle est insérée dans le document
   **Then** elle respecte la numérotation LaTeX existante
   **And** elle utilise les environnements LaTeX corrects pour les maths

## Tasks / Subtasks

- [ ] Implémenter la logique de numérotation LaTeX dans correction-generator.ts (AC: 1)
  - [ ] Analyser la structure du document pour identifier la numérotation existante
  - [ ] Créer une fonction de génération de numéros de section/théorème appropriés
  - [ ] Intégrer la numérotation dans les corrections générées
- [ ] Développer les environnements LaTeX mathématiques appropriés (AC: 1)
  - [ ] Implémenter le support des environnements align, equation, gather
  - [ ] Ajouter la gestion des labels et références LaTeX
  - [ ] Valider la compilation LaTeX des corrections générées
- [ ] Tester l'intégration dans les documents existants (AC: 1)
  - [ ] Créer des tests unitaires pour la numérotation
  - [ ] Tester avec différents types de documents LaTeX
  - [ ] Vérifier la compatibilité avec les environnements LaTeX standards

## Dev Notes

- Relevant architecture patterns and constraints
  - Architecture modulaire avec séparation des responsabilités : Extension VS Code, Parsing LaTeX, Génération IA, Vérification Python, Génération TikZ
  - Technologies clés : TypeScript pour l'extension, Python avec sympy pour vérifications mathématiques, Copilot pour génération IA, TikZ pour graphiques
  - Intégrations : VS Code API pour commandes et éditeur, Copilot Chat pour @corriger, sous-processus Python pour calculs
  - Patterns et pratiques : Modularité, gestion d'erreurs gracieuse, performance optimisée, sécurité et isolation des processus

- Source tree components to touch
  - src/correction-generator.ts : Module principal de génération des corrections
  - src/latex-parser.ts : Parsing et analyse des documents LaTeX
  - src/extension.ts : Point d'entrée et intégration VS Code
  - src/test/extension.test.ts : Tests unitaires

- Testing standards summary
  - Tests unitaires avec Mocha
  - Tests d'intégration pour les fonctionnalités VS Code
  - Tests E2E avec Playwright pour les scénarios complets
  - Couverture de code >80%
  - Tests de performance pour génération <30 secondes

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming)
  - Structure standard d'extension VS Code (src/, out/, package.json)
  - Nommage TypeScript avec interfaces et types explicites
  - Séparation claire entre logique métier et intégration VS Code

- Detected conflicts or variances (with rationale)
  - Aucun conflit détecté - l'implémentation s'intègre naturellement dans l'architecture existante

### References

- Cite all technical details with source paths and sections, e.g. [Source: docs/<file>.md#Section]
  - [Source: _bmad-output/planning-artifacts/prd.md#Functional Requirements] - FR7: L'extension peut structurer les corrections avec numérotation et format LaTeX approprié
  - [Source: _bmad-output/planning-artifacts/architecture.md#Décisions Architecturales de Base] - Architecture modulaire avec parsing LaTeX
  - [Source: _bmad-output/planning-artifacts/epics.md#Epic 2: Génération de Corrections Pédagogiques] - Story 2.3 détails complets
  - [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Expérience utilisateur cœur] - Intégration transparente dans VS Code

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Debug Log References

### Completion Notes List

- Analyse exhaustive des artifacts PRD, architecture, UX et epics complétée
- Extraction des contraintes techniques LaTeX et numérotation identifiées
- Intégration des patterns architecturaux modulaires validée
- Tests unitaires et d'intégration planifiés selon standards Mocha
- Compatibilité avec environnements LaTeX existants assurée

### File List

- src/correction-generator.ts (modification)
- src/latex-parser.ts (modification)
- src/extension.ts (modification)
- src/test/extension.test.ts (modification)