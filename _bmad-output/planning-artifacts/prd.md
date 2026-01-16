---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish"]
inputDocuments: ["planning-artifacts/product-brief-vscode-corriger-extension-2026-01-16.md"]
workflowType: 'prd'
classification:
  projectType: developer_tool
  domain: edtech
  complexity: medium
  projectContext: greenfield
---

# Product Requirements Document - vscode-corriger-extension

**Author:** Nicolas
**Date:** 2026-01-16

## Executive Summary

**vscode-corriger-extension** est une extension VS Code qui automatise la génération de corrigés d'exercices de mathématiques en LaTeX pour le niveau lycée. L'extension détecte automatiquement les exercices dans les documents LaTeX et génère des corrections pédagogiques assistées par IA, avec vérification automatique des calculs et production de graphiques TikZ.

**Problème Résolu:** Les enseignants passent 3-4 heures par semaine à rédiger manuellement des corrigés, occasionnant fatigue et erreurs.

**Solution:** Extension VS Code avec commande palette et intégration Copilot (@corriger) pour génération automatique de corrections précises en <30 secondes.

**Utilisateur Cible:** Philippe Comte, enseignant de maths expérimenté utilisant VS Code et LaTeX pour ses cours.

**Différenciateurs Clés:**
- Spécialisation mathématiques lycée avec programmes français 2026
- Vérification automatique des calculs via Python
- Génération de graphiques TikZ corrects
- Intégration native VS Code + Copilot

**Portée MVP:** Détection exercices, génération corrections, vérification calculs, intégration VS Code.

---

## Success Criteria

### User Success

**Métriques de Succès Utilisateur:**
- **Fonctionnalité perçue:** Philippe sait que l'extension fonctionne quand il génère des corrections précises en quelques minutes
- **Exactitude:** Les corrections générées sont exactes et pédagogiquement adaptées au niveau lycée
- **Comportements indicateurs de valeur:** Utilisation systématique pour tous les nouveaux exercices

### Business Success

**Objectifs Business (POC):**
- N/A - Projet en phase POC, focus sur validation technique et fonctionnelle

### Technical Success

**Critères de Succès Technique:**
- **Fonctionnalités core:** Détection d'exercices LaTeX, génération corrections, vérification calculs Python
- **Qualité:** Précision des corrections >95%, conformité LaTeX, génération TikZ correcte
- **Performance:** Génération <30 secondes par exercice, stabilité VS Code
- **Fiabilité:** Extension stable et sans crash lors de l'utilisation normale

### Measurable Outcomes

**Critères de Succès Global:**
- Philippe peut corriger ses exercices efficacement
- L'extension est stable et fiable
- Validation du concept technique pour développement futur

## Product Scope

### MVP - Minimum Viable Product

**Fonctionnalités Essentielles:**
- Détection automatique des exercices LaTeX avec balises `\begin{exercice}`
- Génération de corrections pédagogiques adaptées au niveau lycée
- Vérification automatique des calculs via Python
- Intégration commande palette VS Code
- Support Copilot avec @corriger
- Production de graphiques TikZ (arbres de probabilité, tableaux de variation)
- Respect de la numérotation et structure LaTeX
- Intelligence pour ignorer les exercices déjà corrigés

### Growth Features (Post-MVP)

**Fonctionnalités Futures:**
- Support d'autres formats LaTeX d'exercices
- Améliorations de performance et optimisation
- Interface utilisateur améliorée si nécessaire

### Vision (Future)

**Vision Long Terme:**
- Consolidation des fonctionnalités MVP validées
- Pas d'expansion majeure prévue au-delà du périmètre défini

---

## Developer Tool Specific Requirements

### Project-Type Overview

**vscode-corriger-extension** est un outil développeur spécialisé dans l'automatisation de corrections d'exercices de mathématiques en LaTeX. L'outil s'intègre nativement dans VS Code et utilise l'IA pour générer des corrections pédagogiques adaptées au niveau lycée.

### Technical Architecture Considerations

**Architecture Technique:**
- Extension VS Code développée en TypeScript/JavaScript
- Intégration avec l'API VS Code et Copilot
- Utilisation de Python pour la vérification automatique des calculs
- Génération de code TikZ pour les graphiques mathématiques

### Language Matrix

**Langages Supportés:**
- **Primaire:** LaTeX (parsing et génération de documents)
- **Secondaire:** TikZ (génération de graphiques mathématiques)
- **Interne:** Python (vérification automatique des calculs)
- **Extension:** TypeScript/JavaScript (développement de l'extension VS Code)

### Installation Methods

**Méthodes d'Installation:**
- **Repository GitHub:** Installation directe depuis le repository pour les développeurs/early adopters
- **Extension VS Code:** Publication sur marketplace VS Code (futur)
- **Dépendances:** VS Code avec Copilot activé, Python pour vérifications calculs

**Prérequis Système:**
- VS Code version 1.70+
- Copilot activé et configuré
- Python 3.8+ pour vérifications calculs
- Node.js pour développement (si compilation nécessaire)

### API Surface

**Interfaces Exposées:**
- **Commande Palette:** `vscode-corriger.corriger` - Correction complète du document
- **API Copilot:** `@corriger` - Interface conversationnelle
- **Configuration:** Settings VS Code pour personnalisation du comportement

**Points d'Extension:**
- Support de nouveaux types d'exercices via configuration
- Intégration avec d'autres IA que Copilot
- Personnalisation des règles de correction

### Code Examples

**Exemples d'Utilisation:**

```latex
% Document LaTeX avec exercices
\begin{exercice}
    \begin{enonce}
        Résoudre l'équation: 2x + 3 = 7
    \end{enonce}
\end{exercice}
```

**Après correction automatique:**
```latex
\begin{exercice}
    \begin{enonce}
        Résoudre l'équation: 2x + 3 = 7
    \end{enonce}
    \begin{correction}
        $2x + 3 = 7$
        $2x = 7 - 3$
        $2x = 4$
        $x = 2$
        % Calcul vérifié
    \end{correction}
\end{exercice}
```

### Migration Guide

**Guide de Migration:**
- **Depuis méthodes manuelles:** Remplacement progressif des corrections manuelles
- **Migration de données:** Aucun impact (travail sur documents LaTeX existants)
- **Formation utilisateurs:** Documentation README et exemples d'utilisation
- **Support backward compatibility:** Documents existants restent inchangés

### Implementation Considerations

**Considérations d'Implémentation:**
- **Performance:** Génération <30 secondes par exercice
- **Fiabilité:** Gestion d'erreurs gracieuse (IA indisponible, exercices non détectés)
- **Sécurité:** Aucune donnée sensible stockée ou transmise
- **Maintenabilité:** Code modulaire avec séparation IA, parsing LaTeX, génération TikZ

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP - Se concentrer sur résoudre efficacement le problème des corrections manuelles d'exercices de mathématiques en LaTeX.

**Ressource Requirements:** 1 développeur full-stack (TypeScript + Python), accès à IA (Copilot), tests utilisateurs enseignants.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Parcours principal de Philippe (correction efficace d'exercices)
- Scénarios 1-4 d'utilisation (palette, sélection, curseur, Copilot global)
- Gestion d'erreurs basique

**Must-Have Capabilities:**
- Détection automatique des exercices LaTeX avec balises `\begin{exercice}`
- Génération de corrections pédagogiques adaptées au niveau lycée
- Vérification automatique des calculs via Python
- Intégration commande palette VS Code
- Support Copilot avec @corriger
- Production de graphiques TikZ (arbres de probabilité, tableaux de variation)
- Respect de la numérotation et structure LaTeX
- Intelligence contextuelle pour ignorer les exercices déjà corrigés

### Post-MVP Features

**Phase 2 (Croissance):**
- Support d'autres formats LaTeX d'exercices
- Améliorations de performance et optimisation
- Interface utilisateur améliorée si nécessaire
- Meilleure gestion d'erreurs et feedback utilisateur

**Phase 3 (Expansion):**
- Consolidation des fonctionnalités MVP validées
- Pas d'expansion majeure prévue au-delà du périmètre défini

### Risk Mitigation Strategy

**Technical Risks:**
- **Complexité intégration IA:** Validation précoce avec Copilot, tests unitaires complets
- **Performance génération:** Optimisations progressives, monitoring des temps de réponse
- **Stabilité extension:** Tests rigoureux, gestion d'erreurs robuste

**Market Risks:**
- **Adoption enseignants:** Tests pilotes avec enseignants réels, feedback itératif
- **Concurrence méthodes traditionnelles:** Focus sur gain de temps démontrable

**Resource Risks:**
- **Disponibilité IA:** Solutions de fallback si Copilot indisponible
- **Complexité développement:** Architecture modulaire, développement itératif

---

## Functional Requirements

### Gestion des Exercices

- FR1: L'enseignant peut faire détecter automatiquement les exercices LaTeX dans un document ouvert
- FR2: L'enseignant peut sélectionner un exercice spécifique pour correction
- FR3: L'extension peut identifier les exercices déjà corrigés et les ignorer
- FR4: L'extension peut analyser la structure des exercices avec balises `\begin{exercice}` et `\begin{enonce}`

### Génération de Corrections

- FR5: L'enseignant peut générer des corrections pédagogiques complètes pour les exercices détectés
- FR6: L'extension peut adapter le niveau pédagogique au lycée (seconde, première, terminale)
- FR7: L'extension peut structurer les corrections avec numérotation et format LaTeX approprié
- FR8: L'extension peut respecter la notation mathématique française (probabilités conditionnelles P_A(B))

### Vérification Mathématique

- FR9: L'extension peut vérifier automatiquement l'exactitude de tous les calculs dans les corrections
- FR10: L'enseignant peut voir les calculs vérifiés avec indication de validation
- FR11: L'extension peut résoudre les équations du second degré avec formule du discriminant
- FR12: L'extension peut développer et factoriser des expressions algébriques

### Intégration Éditeur

- FR13: L'enseignant peut lancer la correction via la palette de commandes VS Code
- FR14: L'enseignant peut utiliser @corriger dans le chat Copilot pour corriger
- FR15: L'extension peut corriger l'exercice au niveau du curseur
- FR16: L'extension peut traiter tous les exercices d'un document en une seule opération

### Production Graphique

- FR17: L'extension peut générer automatiquement des graphiques TikZ pour les exercices mathématiques
- FR18: L'extension peut créer des arbres de probabilité orientés horizontalement
- FR19: L'extension peut produire des tableaux de variation avec signes des dérivées
- FR20: L'extension peut intégrer les graphiques dans le format LaTeX des corrections

### Gestion d'Erreurs

- FR21: L'extension peut informer l'utilisateur quand aucun exercice n'est détecté
- FR22: L'extension peut gérer l'indisponibilité de l'IA avec message approprié
- FR23: L'extension peut proposer des alternatives quand l'IA n'est pas disponible
- FR24: L'extension peut corriger automatiquement les erreurs de format LaTeX généré

---

## Non-Functional Requirements

### Performance

- **Temps de génération :** Chaque correction d'exercice est générée en moins de 30 secondes
- **Temps de démarrage :** L'extension VS Code se charge et devient opérationnelle en moins de 5 secondes
- **Utilisation ressources :** L'extension n'augmente pas significativement l'utilisation CPU/mémoire de VS Code
- **Temps de réponse UI :** Toutes les interactions utilisateur (clics, commandes) répondent en moins de 2 secondes

### Integration

- **Compatibilité VS Code :** Extension compatible avec VS Code version 1.70 et supérieure
- **Support Copilot :** Intégration complète avec GitHub Copilot Chat (@corriger)
- **API VS Code :** Utilisation correcte et conforme des APIs d'extension VS Code
- **Sous-processus Python :** Intégration propre et sécurisée avec l'exécution Python pour vérifications calculs
- **Gestion versions :** Compatibilité maintenue avec les futures versions de VS Code et Copilot

### Reliability

- **Stabilité :** Extension ne présente pas de crash lors d'utilisation normale
- **Gestion d'erreurs :** Récupération gracieuse de toutes les erreurs IA avec messages informatifs
- **Messages utilisateur :** Tous les messages d'erreur sont en français et guident l'utilisateur
- **Continuité de service :** Extension reste fonctionnelle même en cas d'indisponibilité temporaire de l'IA
- **Reprise d'activité :** Possibilité de reprendre les corrections après interruption

---

## User Journeys

### Parcours Principal - Philippe Comte (Succès)

**Scène d'Ouverture:**
Philippe Comte, enseignant de mathématiques expérimenté depuis 20 ans, travaille tard le soir sur ses cours LaTeX dans VS Code. Il vient de terminer la rédaction de plusieurs exercices complexes pour ses élèves de première S. Il sait qu'il doit maintenant créer les corrigés - une tâche qui lui prend habituellement 3-4 heures par semaine et qui le fatigue énormément.

**Développement:**
Philippe installe l'extension vscode-corriger-extension depuis le repository GitHub (pas de marketplace publique pour ce POC). Copilot est déjà configuré dans son VS Code. Il ouvre son document LaTeX contenant les exercices fraîchement créés.

**Point Climatique - Moment "Aha!":**
Philippe utilise la première méthode : il ouvre la palette de commandes (Cmd+Shift+P), tape "corriger", et sélectionne l'extension. En quelques secondes, l'extension détecte automatiquement tous les exercices du document et insère les corrections complètes avec graphiques TikZ après chaque énoncé. Il voit apparaître des corrections pédagogiques précises, avec vérification automatique des calculs et diagrammes mathématiques parfaits.

**Résolution:**
Le workflow de Philippe se transforme complètement. Au lieu de passer des heures à corriger manuellement, il génère maintenant des corrections complètes en quelques minutes. Il utilise l'extension systématiquement pour tous ses nouveaux exercices, retrouvant du temps pour interagir avec ses élèves et préparer de meilleurs cours.

### Scénario 1 - Correction Complète du Document

**Parcours:** Philippe ouvre un document LaTeX complet avec plusieurs exercices. Il utilise Cmd+Shift+P → "corriger". L'extension traite automatiquement tous les exercices non corrigés, ajoutant les environnements `\begin{correction}...\end{correction}` avec contenu pédagogique adapté au niveau lycée.

**Émotion:** Soulagement immédiat en voyant le travail de plusieurs heures se faire en minutes.

### Scénario 2 - Correction d'un Exercice Sélectionné

**Parcours:** Philippe sélectionne un exercice spécifique dans son document. Il ouvre le chat Copilot et saisit "@corriger". L'extension corrige uniquement l'exercice sélectionné, permettant un contrôle précis.

**Émotion:** Satisfaction du contrôle granulaire et de la précision.

### Scénario 3 - Correction par Position du Curseur

**Parcours:** Philippe place son curseur à l'intérieur d'un exercice. Il ouvre le chat Copilot et saisit "@corriger". L'extension détecte l'exercice contenant le curseur et le corrige spécifiquement.

**Émotion:** Commodité de l'interaction naturelle avec Copilot.

### Scénario 4 - Correction Globale via Chat Copilot

**Parcours:** Philippe ouvre simplement le document et le chat Copilot. Il saisit "@corriger" sans sélection. L'extension traite automatiquement tous les exercices du document.

**Émotion:** Simplicité d'utilisation pour les corrections en lot.

### Parcours d'Erreur - Gestion des Problèmes

**Scène d'Ouverture:**
Philippe essaie de corriger un document, mais quelque chose ne fonctionne pas comme attendu.

**Gestion d'Erreurs:**
- **Pas d'exercices détectés:** Message clair "Aucun exercice à corriger trouvé dans ce document"
- **IA non disponible:** Message informatif avec proposition de sélectionner une autre IA
- **Erreur de correction:** Vérification automatique du code LaTeX généré et correction si nécessaire

**Résolution:**
Philippe comprend immédiatement le problème grâce aux messages clairs, et peut résoudre la situation rapidement. L'extension reste fiable et ne casse jamais son workflow.

### Journey Requirements Summary

**Capacités Révélées par les Parcours:**

1. **Détection d'Exercices:** Identification automatique des balises `\begin{exercice}` dans documents LaTeX
2. **Génération de Corrections:** Production de contenu pédagogique adapté lycée avec vérification calculs
3. **Intégration VS Code:** Commande palette + support Copilot avec @corriger
4. **Formats Multiples:** Support de corrections complètes, par sélection, par curseur, ou globales
5. **Gestion d'Erreurs:** Messages clairs et récupération gracieuse des erreurs
6. **Graphics TikZ:** Génération automatique de diagrammes mathématiques corrects
7. **Intelligence Contextuelle:** Ignorer les exercices déjà corrigés
8. **Performance:** Génération rapide (<30 secondes par exercice)