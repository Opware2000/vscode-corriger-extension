# Story 1.1: detection-automatique-des-exercices-latex

Status: ready-for-dev

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

- [ ] Analyser l'API VS Code pour l'accès au contenu du document actif
- [ ] Implémenter la détection des balises `\begin{exercice}` via regex ou parser
- [ ] Analyser la structure interne avec `\begin{enonce}` et autres éléments
- [ ] Créer une liste des exercices détectés avec positions dans le document
- [ ] Gérer les exercices déjà corrigés (balises `\begin{correction}`)
- [ ] Intégrer la fonctionnalité dans la commande principale de l'extension

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

### File List

- src/latex-parser.ts (nouveau)
- src/extension.ts (modification pour intégrer la détection)