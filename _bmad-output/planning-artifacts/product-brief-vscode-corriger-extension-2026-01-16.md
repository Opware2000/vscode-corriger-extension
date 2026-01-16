---
stepsCompleted: [1, 2]
inputDocuments: []
date: 2026-01-16
author: Nicolas
---

# Product Brief: vscode-corriger-extension

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

**vscode-corriger-extension** est une extension pour Visual Studio Code qui automatise la création de corrigés d'exercices de mathématiques en LaTeX pour le niveau lycée. L'extension fournit une commande dans la palette de commandes VS Code et s'intègre également au chat Copilot via @corriger pour générer des corrections pédagogiques assistées par IA.

L'extension détecte automatiquement les exercices dans les documents LaTeX (balises `\begin{exercice}...\end{exercice}`) et insère les corrections structurées entre balises `\begin{correction}...\end{correction}`.

---

## Core Vision

### Problème Central

Les enseignants de mathématiques au lycée passent un temps considérable à rédiger manuellement les corrigés d'exercices en LaTeX. Ce processus:
- Est chronophage et répétitif
- Nécessite une vérification manuelle de chaque calcul
- Demande une expertise pour produire des diagrammes TikZ (arbres de probabilité, tableaux de variation)
- Est propice aux erreurs de calcul ou de frappe

### Impact du Problème

- Perte de temps pédagogique précieux (création de contenu vs. interaction avec les élèves)
- Fatigue et risque d'erreurs dans les corrections
- Difficulté à maintenir une cohérence dans le format des corrections
- Barrière pour les enseignants moins familiers avec LaTeX

### Pourquoi les Solutions Existantes Sont Insuffisantes

- Les outils de correction automatique généralistes ne comprennent pas le contexte pédagogique du lycée
- Les générateurs de LaTeX existants ne gèrent pas spécifiquement les exercices de mathématiques
- L'intégration avec l'écosystème VS Code et Copilot est manquante
- Les diagrammes TikZ nécessitent une expertise technique

### Solution Proposée

Une extension VS Code spécialisée qui:
1. Détecte automatiquement les exercices LaTeX avec leurs balises (format utilisé par les enseignants cibles)
2. Génère des corrections pédagogiques adaptées au niveau lycée (programmes français 2026)
3. Vérifie automatiquement les calculs (développement, factorisation, résolution) via Python
4. Produce des graphiques TikZ corrects (arbres de probabilité, tableaux de variation)
5. Respecte la numérotation et la structure de l'énoncé
6. S'intègre à VS Code (commande palette) et Copilot (@corriger)
7. Ignore les exercices déjà corrigés pour gagner du temps et respecter l'expertise des enseignants

### Différenciateurs Clés

- **Spécialisation Mathématiques Lycée**: Corrections pédagogiques adaptées aux programmes français 2026 (seconde, première, terminale)
- **Intégration native VS Code**: Accès direct depuis la palette de commandes
- **Support Copilot**: Utilisable via @corriger dans le chat Copilot pour une interaction naturelle
- **Vérification automatique**: Tous les calculs sont vérifiés avec Python et validés
- **Graphics TikZ automatique**: Production de diagrammes mathématiques compatibles avec les documents des enseignants
- **Format de sortie structuré**: Respect strict du format LaTeX attendu
- **Intelligence contextuelle**: Ignore les exercices déjà corrigés

---

## Hypothèses Validées

### Pourquoi un agent personnalisé plutôt qu'une extension standard ?
Intégration fluide avec Copilot, syntaxe `@corriger` intuitive pour les enseignants.

### Pourquoi seulement les exercices de mathématiques lycée ?
Marché cible clair, besoins pédagogiques spécifiques, expertise délimitée pour le POC.

### Pourquoi détecter les exercices via des balises LaTeX ?
Format structuré, fiabilité de détection, conformité aux pratiques des enseignants cibles.

### Pourquoi TikZ pour les graphiques ?
Intégration native LaTeX, qualité professionnelle, réutilisation dans les cours des enseignants.

### Pourquoi vérifier les calculs avec un commentaire ?
Transparence pour les enseignants, distinction entre calculs vérifiés et non vérifiés.
