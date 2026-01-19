# Story 5.2: creation-d-arbres-de-probabilite-horizontaux

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a enseignant de maths,
I want que l'IA crée des arbres de probabilité orientés horizontalement,
So that les représentations probabilistes sont claires.

## Acceptance Criteria

**Given** un exercice de probabilités avec arbre
**When** l'IA génère le graphique
**Then** l'arbre est orienté horizontalement
**And** les probabilités sont correctement positionnées

## Tasks / Subtasks

- [x] Étendre les prompts TikZ pour arbres de probabilité horizontaux (AC: 1)
  - [x] Ajouter instructions spécifiques pour orientation horizontale des arbres
  - [x] Inclure exemples d'arbres de probabilité avec tkz-tree ou tikz
  - [x] Spécifier format LaTeX correct pour intégration dans corrections

## Dev Notes

- Focus sur extension des prompts existants pour arbres de probabilité horizontaux
- Bâtir sur l'implémentation story 5.1 pour génération automatique TikZ
- Respecter les contraintes de performance (<30s génération)
- Utiliser prompts spécialisés pour que IA détecte besoins arbres probabilité et génère TikZ horizontal

### Exemples TikZ pour arbres de probabilité horizontaux

**Arbre de probabilité simple (2 niveaux) :**
```latex
\begin{center}
\begin{tikzpicture}[grow=right, level distance=2cm, sibling distance=1cm]
  \node {Événement A}
    child {node {Sous-événement A1} edge from parent node[left] {0.3}}
    child {node {Sous-événement A2} edge from parent node[right] {0.7}};
\end{tikzpicture}
\end{center}
```

**Arbre de probabilité avec tkz-tree :**
```latex
\begin{center}
\begin{tikzpicture}
  \tikzset{edge from parent/.style={draw, edge label}}
  \node {A}
    child {node {B} edge from parent node {0.4}}
    child {node {C} edge from parent node {0.6}};
\end{tikzpicture}
\end{center}
```

### Project Structure Notes

- Modifications dans src/prompts/tikz-instructions.md pour ajouter exemples arbres probabilité
- Utilisation modules existants : correction-generator.ts appelle prompts
- Respect de la structure TypeScript/webpack du starter VS Code
- Extension architecture actuelle inchangée - output IA inséré tel quel

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Décisions Architecturales de Base] - Technologies clés incluant génération TikZ
- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.2: Création d'arbres de probabilité horizontaux] - Détails de la story
- [Source: src/correction-generator.ts] - Module existant pour génération corrections
- [Source: src/prompts/tikz-instructions.md] - Prompts TikZ existants à étendre

## Contexte Développeur

### Exigences Techniques
- Extension des prompts dans src/prompts/tikz-instructions.md pour inclure instructions arbres probabilité horizontaux
- Extension correction-generator.ts utilise prompts existants - pas de modification nécessaire
- IA détecte automatiquement besoins arbres probabilité et génère TikZ horizontal approprié
- Output IA inséré tel quel - extension ne valide pas syntaxe TikZ

### Conformité Architecture
- Respect de l'architecture modulaire (parsing/génération séparés)
- Utilisation Copilot pour génération IA
- Intégration propre avec processus Python si nécessaire pour validation
- Respect des contraintes performance (<30s)

### Exigences Bibliothèques et Frameworks
- TypeScript pour logique extension
- Copilot/OpenAI pour génération TikZ arbres probabilité
- Pas de nouvelles dépendances externes requises
- Utilisation APIs VS Code existantes

### Exigences Structure Fichiers
- Modifications dans src/prompts/tikz-instructions.md
- Extension src/correction-generator.ts si nécessaire pour nouveaux patterns
- Tests dans src/test/ pour validation génération arbres probabilité
- Respect structure webpack du projet

### Exigences Tests
- Tests unitaires pour détection besoins arbres probabilité
- Tests d'intégration pour génération TikZ arbres horizontaux complète
- Tests de validation syntaxe LaTeX/TikZ pour arbres
- Couverture minimale 80% pour nouvelles fonctionnalités

## Intelligence Précédente Story
- Story 5.1 terminée : génération automatique graphiques TikZ - patterns prompts spécialisés, exemples TikZ inclus, intégration LaTeX
- Apprentissages : utilisation prompts détaillés pour qualité IA, inclusion exemples concrets, format LaTeX center avec scale, déclaration packages nécessaires

## Résumé Intelligence Git
- Derniers commits : implémentation story 5.1 TikZ, corrections revue code, mise à jour statuts
- Patterns : modularité composants, gestion erreurs gracieuse, tests Mocha, constantes chemins
- Technologies : TypeScript strict, webpack bundling, intégration Copilot

## Informations Techniques Récentes
- TikZ stable dans LaTeX 2023, tkz-tree package disponible pour arbres
- Copilot API stable pour génération code TikZ
- Arbres de probabilité horizontaux utilisent grow=right dans tikz
- Pas de changements breaking détectés

## Référence Contexte Projet
- Extension VS Code pour correction exercices maths LaTeX
- Cible : enseignants lycée, intégration Copilot
- Technologies : TypeScript, Python pour calculs, TikZ pour graphiques
- Architecture modulaire : parsing LaTeX, génération IA, vérification calculs

## Statut Final Story
Status: ready-for-dev
Completion Note: Analyse exhaustive complétée - guide développeur complet créé pour implémentation arbres probabilité horizontaux TikZ

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Debug Log References

### Completion Notes List

Extended tikz-instructions.md with specific instructions for horizontal probability trees, added multiple examples using both TikZ and tkz-tree, updated integration guidelines with scale for trees and updated comment.

### File List

- src/prompts/tikz-instructions.md