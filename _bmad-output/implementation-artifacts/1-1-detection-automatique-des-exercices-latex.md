# Story 1.1: detection-automatique-des-exercices-latex

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a enseignant de maths,
I want détecter automatiquement tous les exercices dans un document LaTeX ouvert,
so that je peux voir rapidement quels exercices nécessitent une correction.

## Acceptance Criteria

1. Given un document LaTeX ouvert contenant des balises `\begin{exercice}`
   When l'extension analyse le document
   Then elle identifie et liste tous les exercices présents
   And elle analyse leur structure avec balises `\begin{exercice}` et `\begin{enonce}`

## Tasks / Subtasks

- [x] Analyser l'API VS Code pour l'accès au contenu du document actif
- [x] Implémenter la détection des balises `\begin{exercice}` via regex ou parser
- [x] Analyser la structure interne avec `\begin{enonce}` et autres éléments
- [x] Créer une liste des exercices détectés avec positions dans le document
- [x] Gérer les exercices déjà corrigés (balises `\begin{correction}`)
- [x] Intégrer la fonctionnalité dans la commande principale de l'extension

## Dev Notes

- Utiliser l'API VS Code `vscode.workspace.textDocuments` pour accéder au document actif
- Implémenter parsing LaTeX avec expressions régulières pour les environnements
- Respecter la structure hiérarchique des exercices (exercice > enonce > sous-parties)
- Gérer les exercices imbriqués et multiples dans un document
- Optimiser les performances pour les documents volumineux

### Project Structure Notes

- Extension VS Code en TypeScript avec architecture modulaire
- Séparation parsing LaTeX du code principal de l'extension
- Utilisation de webpack pour le bundling
- Tests unitaires avec Mocha pour valider la détection

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1: Détection automatique des exercices LaTeX]
- [Source: _bmad-output/planning-artifacts/architecture.md#Parsing LaTeX]
- [Source: _bmad-output/planning-artifacts/prd.md#FR1]

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Implementation Plan

- Créer un module `latex-parser.ts` pour la détection des exercices
- Utiliser des regex pour identifier `\begin{exercice}` et `\end{exercice}`
- Analyser le contenu entre les balises pour extraire la structure
- Intégrer avec l'API VS Code pour obtenir le texte du document
- Ajouter gestion des erreurs pour documents malformés

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created
Story 1.1 créée avec analyse complète du contexte architectural et des exigences
Intégration VS Code API pour accès document, parsing LaTeX avec regex
Gestion des exercices déjà corrigés et structure hiérarchique
Prêt pour implémentation avec dev-story
✅ Tâche 1 complétée: Analyse API VS Code pour accès document actif - fonction getActiveDocumentContent implémentée avec tests
✅ Tâche 2 complétée: Détection des balises \begin{exercice} - fonction detectExercises implémentée avec regex et tests
✅ Tâche 3 complétée: Analyse structure interne avec \begin{enonce} - fonction parseExerciseStructure implémentée avec tests
✅ Tâche 4 complétée: Création liste exercices avec positions - fonction detectExercises retourne positions start/end
✅ Tâche 5 complétée: Gestion exercices corrigés - parseExerciseStructure gère \begin{correction}
✅ Tâche 6 complétée: Intégration dans commande principale - extension.ts modifié pour détecter et afficher exercices

### File List

- src/latex-parser.ts (nouveau)
- src/extension.ts (modification pour intégrer la détection)
- src/document-access.ts (nouveau - accès au contenu du document actif)
- src/test/extension.test.ts (modification - ajout test pour getActiveDocumentContent)

### Change Log

- Implémentation complète de la détection automatique des exercices LaTeX (Date: 2026-01-16)