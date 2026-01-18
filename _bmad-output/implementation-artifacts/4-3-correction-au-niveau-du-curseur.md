# Story 4.3: correction-au-niveau-du-curseur

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an enseignant de maths,
I want que l'extension corrige l'exercice au niveau du curseur,
So that je peux corriger précisément un exercice spécifique.

## Acceptance Criteria

1. **Given** mon curseur à l'intérieur d'un exercice
   **When** je lance la correction
   **Then** seule l'exercice contenant le curseur est corrigé
   **And** les autres exercices restent inchangés

## Tasks / Subtasks

- [ ] Analyser la position du curseur dans le document LaTeX
- [ ] Identifier l'exercice contenant le curseur (parsing des balises \begin{exercice})
- [ ] Implémenter la logique de correction ciblée pour un seul exercice
- [ ] Intégrer avec les systèmes existants de détection et génération
- [ ] Ajouter une commande dédiée ou étendre la commande existante avec mode curseur
- [ ] Gérer les cas d'erreur (curseur pas dans un exercice, exercice déjà corrigé)
- [ ] Tester l'intégration avec la position du curseur

## Dev Notes

- Suivre les patterns établis dans les stories 4-1 et 4-2 pour l'intégration VS Code
- Utiliser l'API VS Code pour obtenir la position du curseur (vscode.window.activeTextEditor.selection.active)
- Étendre la logique de detectExercises pour identifier l'exercice spécifique au curseur
- Réutiliser generateAndInsertCorrection pour la génération de correction
- Respecter les contraintes de performance (<2 secondes pour réponse UI)
- Maintenir la compatibilité avec VS Code 1.70+

### Project Structure Notes

- Extension de src/extension.ts pour nouvelle commande ou paramètre de commande existante
- Utilisation des modules existants : latex-parser.ts pour la détection, correction-generator.ts pour la génération
- Tests dans src/test/suites/ pour valider le comportement au curseur
- Respect de la structure modulaire établie (parsing LaTeX, génération IA, etc.)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Intégrations] - API VS Code pour gestion du curseur et éditeur
- [Source: _bmad-output/planning-artifacts/prd.md#FR15] - Spécifications de correction au niveau du curseur
- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.3] - Critères d'acceptation détaillés
- [Source: _bmad-output/implementation-artifacts/4-1-lancement-via-palette-de-commandes-vs-code.md] - Patterns d'implémentation commande palette
- [Source: _bmad-output/implementation-artifacts/4-2-utilisation-de-corriger-dans-copilot.md] - Logique de détection contexte curseur
- [Source: src/extension.ts] - Point d'extension pour nouvelles commandes
- [Source: src/latex-parser.ts] - Logique de parsing LaTeX existante
- [Source: src/correction-generator.ts] - Génération de corrections existante

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Debug Log References

### Completion Notes List

### File List