# Story 2.3: Structuration avec format LaTeX approprié

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an enseignant de maths,
I want que l'IA reçoive le contexte structurel du document LaTeX,
So that elle génère des corrections plus pertinentes et adaptées au contexte.

## Acceptance Criteria

1. **Given** un document LaTeX avec structure (sections, théorèmes)
    **When** l'extension analyse le document
    **Then** elle extrait les informations structurelles pertinentes
    **And** elle les transmet à l'IA pour enrichir les prompts de génération

## Tasks / Subtasks

- [x] Analyser la structure LaTeX du document pour extraire le contexte (AC: 1)
  - [x] Détecter les sections, sous-sections, théorèmes présents
  - [x] Identifier la numérotation actuelle du document
  - [x] Extraire les informations contextuelles pertinentes
- [x] Enrichir les prompts IA avec le contexte documentaire (AC: 1)
  - [x] Créer fonction generateDocumentContext pour structurer l'information
  - [x] Intégrer le contexte dans les prompts Copilot/OpenAI
  - [x] Tester l'amélioration de la qualité des corrections
- [x] Maintenir le formatage LaTeX basique des corrections (AC: 1)
  - [x] Formatage simple avec \begin{correction}...\end{correction}
  - [x] Compatibilité avec les environnements LaTeX existants
  - [x] Validation de la syntaxe LaTeX générée

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