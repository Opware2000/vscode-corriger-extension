# Story 4.4: traitement-de-tous-les-exercices-du-document

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an enseignant de maths,
I want traiter tous les exercices d'un document en une seule opération,
So that je peux corriger en lot pour gagner du temps.

## Acceptance Criteria

1. **Given** un document avec plusieurs exercices
   **When** je lance la correction globale
   **Then** tous les exercices non corrigés sont traités
   **And** les corrections sont insérées dans l'ordre approprié

## Tasks / Subtasks

- [ ] Analyser tous les exercices non corrigés dans le document
- [ ] Générer des corrections pour chaque exercice détecté
- [ ] Insérer les corrections dans l'ordre approprié dans le document
- [ ] Gérer les erreurs individuelles sans arrêter le processus global
- [ ] Fournir un rapport de synthèse des corrections effectuées
- [ ] Respecter les contraintes de performance pour traitement en lot

## Dev Notes

- Suivre les patterns établis dans les stories 4-1, 4-2 et 4-3 pour l'intégration VS Code
- Étendre la logique de detectExercises pour traiter tous les exercices
- Utiliser generateAndInsertCorrection pour chaque exercice avec gestion d'erreurs
- Implémenter un mode "batch" pour optimiser les appels IA
- Respecter les contraintes de performance (<30 secondes total pour document complet)
- Maintenir la compatibilité avec VS Code 1.70+ et Copilot

### Project Structure Notes

- Extension de src/extension.ts pour nouvelle commande ou paramètre de commande existante
- Utilisation des modules existants : latex-parser.ts pour la détection, correction-generator.ts pour la génération
- Tests dans src/test/suites/ pour valider le comportement en lot
- Respect de la structure modulaire établie (parsing LaTeX, génération IA, vérification Python)

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR16] - Spécifications de traitement de tous les exercices
- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.4] - Critères d'acceptation détaillés
- [Source: _bmad-output/planning-artifacts/architecture.md#Décisions Architecturales de Base] - Architecture modulaire avec séparation des responsabilités
- [Source: _bmad-output/implementation-artifacts/4-1-lancement-via-palette-de-commandes-vs-code.md] - Patterns d'implémentation commande palette
- [Source: _bmad-output/implementation-artifacts/4-2-utilisation-de-corriger-dans-copilot.md] - Logique de génération de corrections
- [Source: _bmad-output/implementation-artifacts/4-3-correction-au-niveau-du-curseur.md] - Gestion de la position et contexte
- [Source: src/extension.ts] - Point d'extension pour nouvelles commandes
- [Source: src/latex-parser.ts] - Logique de parsing LaTeX existante
- [Source: src/correction-generator.ts] - Génération de corrections existante

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Debug Log References

### Completion Notes List

### File List