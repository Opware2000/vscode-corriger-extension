# Story 5.1: generation-automatique-de-graphiques-tikz

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a enseignant de maths,
I want que l'IA génère automatiquement des graphiques TikZ pour les exercices mathématiques,
So that les corrections incluent des représentations visuelles.

## Acceptance Criteria

**Given** un exercice nécessitant un graphique
**When** l'extension génère la correction
**Then** elle produit le code TikZ approprié
**And** elle l'intègre dans la correction LaTeX

## Tasks / Subtasks

- [ ] Mettre à jour les prompts IA pour génération automatique graphiques TikZ (AC: 1)
  - [ ] Ajouter instructions spécifiques dans prompts pour génération TikZ
  - [ ] Inclure exemples de code TikZ pour arbres probabilité horizontaux et tableaux variation
  - [ ] Spécifier format LaTeX correct pour intégration TikZ

## Dev Notes

- Focus sur amélioration prompts IA pour génération automatique TikZ
- Extension existante déjà gère insertion output IA - pas de modification nécessaire
- Respecter les contraintes de performance (<30s génération)
- Utiliser prompts spécialisés pour que IA détecte besoins graphiques et génère TikZ

### Exemples TikZ à inclure dans prompts

**Tableau de variation simple :**
```latex
\begin{center}
  \begin{tikzpicture}[scale=0.7]
  \tkzTabInit[lgt=2,espcl=2]{$x$/1, $f'(x)$/1, $f(x)$/2}{$-\infty$, $2$, $+\infty$}
  \tkzTabLine{, -, z, +, }
  \tkzTabVar{+/, -/$-1$, +/}
  \end{tikzpicture}
\end{center}
```

**Tableau de variation avec dérivée du second degré :**
```latex
\begin{center}
  \begin{tikzpicture}[scale=0.7]
  \tkzTabInit[lgt=2,espcl=2]{$x$/1, $f'(x)$/1, $f(x)$/2}{$-\infty$, $-1$, $2$, $+\infty$}
  \tkzTabLine{, +, z, -, z, +, }
  \tkzTabVar{-/, +/$12$, -/$-15$, +/}
  \end{tikzpicture}
\end{center}
```

### Project Structure Notes

- Modifications dans src/prompts/ pour ajouter instructions TikZ
- Utilisation modules existants : correction-generator.ts appelle prompts
- Respect de la structure TypeScript/webpack du starter VS Code
- Extension architecture actuelle inchangée - output IA inséré tel quel

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Décisions Architecturales de Base] - Technologies clés incluant génération TikZ
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 5: Production de Graphiques Mathématiques] - Détails de l'épic et story
- [Source: src/correction-generator.ts] - Module existant pour génération corrections

## Contexte Développeur

### Exigences Techniques
- Mise à jour des prompts dans src/prompts/ pour inclure instructions génération TikZ
- Extension correction-generator.ts utilise prompts existants - pas de modification
- IA détecte automatiquement besoins graphiques et génère TikZ approprié
- Output IA inséré tel quel - extension ne valide pas syntaxe TikZ

### Conformité Architecture
- Respect de l'architecture modulaire (parsing/génération séparés)
- Utilisation Copilot pour génération IA
- Intégration propre avec processus Python si nécessaire pour validation
- Respect des contraintes performance (<30s)

### Exigences Bibliothèques et Frameworks
- TypeScript pour logique extension
- Copilot/OpenAI pour génération TikZ
- Pas de nouvelles dépendances externes requises
- Utilisation APIs VS Code existantes

### Exigences Structure Fichiers
- Modifications dans src/correction-generator.ts
- Extension src/prompts/ pour prompts TikZ
- Tests dans src/test/ pour validation génération
- Respect structure webpack du projet

### Exigences Tests
- Tests unitaires pour détection besoins graphiques
- Tests d'intégration pour génération TikZ complète
- Tests de validation syntaxe LaTeX/TikZ
- Couverture minimale 80% pour nouvelles fonctionnalités

## Intelligence Précédente Story
- Story 4.4 terminée : traitement global exercices - patterns intégration LaTeX
- Story 2.4 terminée : notation française - prompts spécialisés pour IA
- Apprentissages : utilisation prompts détaillés pour qualité IA, validation outputs

## Résumé Intelligence Git
- Derniers commits : intégrations Copilot, parsing LaTeX amélioré
- Patterns : modularité composants, gestion erreurs gracieuse
- Technologies : TypeScript strict, tests Mocha

## Informations Techniques Récentes
- TikZ stable dans LaTeX 2023, compatibilité assurée
- Copilot API stable pour génération code
- Pas de changements breaking détectés

## Référence Contexte Projet
- Extension VS Code pour correction exercices maths LaTeX
- Cible : enseignants lycée, intégration Copilot
- Technologies : TypeScript, Python pour calculs, TikZ pour graphiques

## Statut Final Story
Status: ready-for-dev
Completion Note: Analyse exhaustive complétée - guide développeur complet créé pour génération automatique graphiques TikZ

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Debug Log References

### Completion Notes List

### File List