# Story 1.3: identification-des-exercices-deja-corriges

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a enseignant de maths,
I want que l'extension identifie automatiquement les exercices déjà corrigés,
so that je ne corrige pas deux fois le même exercice.

## Acceptance Criteria

1. Given un document avec des exercices corrigés (balises `\begin{correction}`)
   When l'extension analyse le document
   Then elle marque les exercices déjà corrigés comme ignorés
   And elle ne propose pas de les corriger à nouveau

## Tasks / Subtasks

- [ ] Étendre la fonction parseExerciseStructure pour marquer les exercices avec correction comme 'ignored'
- [ ] Modifier detectExercises pour filtrer les exercices ignorés de la liste proposée
- [ ] Ajouter une propriété 'status' aux objets Exercise (pending, ignored, corrected)
- [ ] Mettre à jour l'interface de sélection pour exclure les exercices ignorés
- [ ] Ajouter des tests unitaires pour la détection des exercices corrigés
- [ ] Gérer les cas limites (correction partielle, correction malformée)

## Dev Notes

- Bâtir sur la logique existante de parseExerciseStructure qui détecte déjà `\begin{correction}`
- Respecter l'architecture modulaire : extension du parsing LaTeX sans casser les fonctionnalités existantes
- Maintenir la performance : filtrage efficace des exercices ignorés
- UX cohérente : feedback clair sur les exercices ignorés (optionnel : affichage dans une liste séparée)

### Project Structure Notes

- Extension de src/latex-parser.ts pour enrichir les objets Exercise avec statut
- Modification de src/exercise-selector.ts pour filtrer les exercices ignorés
- Respect des patterns établis dans stories 1.1 et 1.2 (modularité, tests unitaires)
- Utilisation de webpack pour bundling, tests avec Mocha

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3: Identification des exercices déjà corrigés]
- [Source: _bmad-output/planning-artifacts/architecture.md#Parsing LaTeX]
- [Source: _bmad-output/planning-artifacts/prd.md#FR3]
- [Source: _bmad-output/implementation-artifacts/1-1-detection-automatique-des-exercices-latex.md#Completion Notes]
- [Source: _bmad-output/implementation-artifacts/1-2-selection-d-un-exercice-specifique.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Implementation Plan

- Étendre l'interface Exercise avec propriété status: 'pending' | 'ignored' | 'corrected'
- Modifier parseExerciseStructure pour détecter `\begin{correction}` et marquer comme 'corrected'
- Ajouter logique de filtrage dans detectExercises pour exclure les exercices 'corrected'
- Mettre à jour showQuickPick pour ne montrer que les exercices 'pending'
- Ajouter tests pour validation du statut des exercices
- Maintenir compatibilité avec les stories précédentes

### Previous Story Intelligence

**Story 1.1 Learnings:**
- parseExerciseStructure gère déjà la détection de `\begin{correction}` - réutiliser cette logique
- Structure des objets Exercise établie : start, end, content, enonce
- Tests unitaires en place pour le parsing - étendre pour les statuts
- Performance optimisée avec regex globales

**Story 1.2 Learnings:**
- Interface QuickPick utilisée pour la sélection - filtrer les exercices avant affichage
- Mise en surbrillance via TextEditorDecorations - applicable aux exercices filtrés
- Gestion d'erreurs pour cas limites - étendre pour exercices ignorés
- Cohérence UX maintenue avec feedback immédiat

**Git Intelligence:**
- Patterns de commit : messages en français, focus sur fonctionnalités spécifiques
- Structure de code : modules séparés (latex-parser, exercise-selector)
- Tests unitaires systématiques avec Mocha
- Revue de code : amélioration sécurité types, extraction constantes, tests supplémentaires

### Latest Tech Information

- VS Code API stable pour parsing et sélection
- TypeScript strict activé avec noImplicitReturns, noUnusedParameters
- ESLint configuré avec règles TypeScript
- Regex patterns éprouvés pour parsing LaTeX

### Architecture Compliance

**Technical Stack:** TypeScript, VS Code API, parsing LaTeX avec regex
**Code Structure:** Extension modulaire de latex-parser.ts et exercise-selector.ts
**Testing Standards:** Tests unitaires Mocha pour toutes nouvelles fonctionnalités
**Performance Requirements:** Filtrage efficace, pas d'impact sur détection existante

### Library Framework Requirements

- VS Code API : vscode.window.showQuickPick, vscode.TextEditor.setDecorations
- Pas de nouvelles dépendances externes requises

### File Structure Requirements

- src/latex-parser.ts : enrichir interface Exercise, étendre parseExerciseStructure
- src/exercise-selector.ts : modifier pour filtrer exercices ignorés
- src/test/extension.test.ts : ajouter tests pour statuts d'exercices

### Testing Requirements

- Tests unitaires pour détection des exercices corrigés
- Tests pour filtrage des exercices ignorés dans la sélection
- Tests de cas limites (correction partielle, malformée)

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created
Story 1.3 créée avec analyse exhaustive du contexte architectural et des exigences
Extension de la logique de parsing pour identification des exercices corrigés
Filtrage automatique des exercices ignorés dans l'interface de sélection
Prêt pour implémentation avec dev-story

### File List

- src/latex-parser.ts (modification - ajout propriété status aux objets Exercise)
- src/exercise-selector.ts (modification - filtrage des exercices ignorés)
- src/test/extension.test.ts (modification - ajout tests pour statuts d'exercices)

### Change Log

- Création de l'histoire 1.3 pour identification des exercices déjà corrigés (Date: 2026-01-17)