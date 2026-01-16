# Story 1.2: selection-d-un-exercice-specifique

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a enseignant de maths,
I want sélectionner un exercice spécifique dans la liste détectée,
so that je peux me concentrer sur un exercice particulier.

## Acceptance Criteria

1. Given une liste d'exercices détectés
   When je sélectionne un exercice dans la liste
   Then l'exercice est mis en surbrillance dans le document
   And l'extension se prépare à corriger cet exercice spécifique

## Tasks / Subtasks

- [x] Analyser l'API VS Code pour les interfaces de sélection (QuickPick, InputBox)
- [x] Créer une interface utilisateur pour afficher la liste des exercices détectés
- [x] Implémenter la logique de sélection avec retour de l'exercice choisi
- [x] Ajouter la mise en surbrillance de l'exercice sélectionné dans l'éditeur
- [x] Intégrer la fonctionnalité de sélection dans le workflow de correction
- [x] Gérer les cas d'erreur (aucun exercice détecté, sélection annulée)
- [x] Ajouter des tests unitaires pour la fonctionnalité de sélection

## Dev Notes

- Utiliser l'API VS Code `vscode.window.showQuickPick` pour la sélection d'exercice
- Respecter les patterns UX définis : simplicité radicale et feedback immédiat
- Maintenir la cohérence avec l'architecture modulaire (séparation UI/logique)
- Optimiser les performances pour les listes d'exercices volumineuses
- Gérer la localisation française pour les messages utilisateur

### Project Structure Notes

- Extension VS Code en TypeScript avec architecture modulaire
- Séparation logique de sélection UI du parsing LaTeX existant
- Utilisation de webpack pour le bundling et optimisation
- Tests unitaires avec Mocha pour valider la sélection et mise en surbrillance
- Respect des conventions de nommage et structure établies dans story 1.1

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2: Sélection d'un exercice spécifique]
- [Source: _bmad-output/planning-artifacts/architecture.md#Extension VS Code]
- [Source: _bmad-output/planning-artifacts/prd.md#FR2]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Interactions effortless]

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Implementation Plan

- Étendre le module `latex-parser.ts` pour retourner des objets Exercise avec métadonnées
- Créer un module `exercise-selector.ts` pour gérer l'interface de sélection
- Utiliser `vscode.window.showQuickPick` avec items formatés (numéro, titre, position)
- Implémenter la mise en surbrillance via `vscode.TextEditor.setDecorations`
- Intégrer dans `extension.ts` avec gestion des états (liste détectée → sélection → correction)
- Ajouter gestion d'erreurs et messages informatifs en français

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created
Story 1.2 créée avec analyse complète du contexte architectural et des exigences
Extension de l'API VS Code pour sélection d'exercice avec QuickPick
Mise en surbrillance via decorations API, intégration UX cohérente
Prêt pour implémentation avec dev-story
Implémentation complète de la fonctionnalité de sélection d'exercice spécifique
API VS Code analysée et utilisée (showQuickPick, setDecorations)
Interface utilisateur créée avec QuickPick pour liste d'exercices
Logique de sélection implémentée avec retour d'exercice choisi
Mise en surbrillance ajoutée via TextEditorDecorations
Intégration dans workflow de correction (commande detectExercises étendue)
Gestion d'erreurs pour cas limites (aucun exercice, annulation)
Tests unitaires ajoutés pour toutes les fonctionnalités

### File List

- src/exercise-selector.ts (nouveau - interface de sélection d'exercice avec QuickPick et mise en surbrillance)
- src/extension.ts (modification - intégration sélection dans workflow de correction)
- src/latex-parser.ts (modification - enrichissement objets Exercise avec numéro et titre)
- src/test/extension.test.ts (modification - ajout tests unitaires pour sélection)
- _bmad-output/implementation-artifacts/sprint-status.yaml (modification - mise à jour statut story)

### Change Log

- Implémentation complète de la sélection d'exercice spécifique (Date: 2026-01-16)
- Analyse API VS Code QuickPick et InputBox (Date: 2026-01-16)
- Création interface utilisateur avec QuickPick (Date: 2026-01-16)
- Implémentation logique de sélection et retour d'exercice (Date: 2026-01-16)
- Ajout mise en surbrillance via TextEditorDecorations (Date: 2026-01-16)
- Intégration dans workflow de correction (Date: 2026-01-16)
- Gestion erreurs et cas limites (Date: 2026-01-16)
- Tests unitaires complets (Date: 2026-01-16)