---
stepsCompleted: [1, 2, 3]
inputDocuments: ["product-brief-vscode-corriger-extension-2026-01-16.md", "prd.md"]
workflowType: 'architecture'
project_name: 'vscode-corriger-extension'
user_name: 'Nicolas'
date: '2026-01-16'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

L'extension doit détecter les exercices LaTeX avec balises `\begin{exercice}`, générer des corrections pédagogiques adaptées au niveau lycée, vérifier automatiquement les calculs via Python, s'intégrer à la palette de commandes VS Code et au chat Copilot (@corriger), produire des graphiques TikZ pour les arbres de probabilité et tableaux de variation, respecter la structure LaTeX, ignorer les exercices déjà corrigés, et gérer les erreurs gracieusement.

**Non-Functional Requirements:**

- Performance: génération de corrections <30 secondes, chargement extension <5 secondes, réponses UI <2 secondes
- Intégration: compatible VS Code 1.70+, support Copilot Chat, utilisation Python 3.8+ pour vérifications calculs
- Fiabilité: extension stable sans crash, gestion d'erreurs gracieuse avec messages en français, récupération après interruption
- Sécurité: aucune donnée sensible stockée ou transmise

**Scale & Complexity:**

- Primary domain: développement d'extension VS Code avec intégration IA
- Complexity level: moyenne
- Estimated architectural components: 5-7 composants principaux (parsing LaTeX, génération IA, vérification Python, intégration VS Code, génération TikZ, gestion erreurs)

### Technical Constraints & Dependencies

- API VS Code pour commandes et intégration éditeur
- API Copilot Chat pour interactions @corriger
- Exécution sous-processus Python pour vérifications mathématiques
- Parsing et génération de code LaTeX/TikZ
- Gestion des environnements LaTeX pour compilation

### Cross-Cutting Concerns Identified

- Performance des générations IA (limite 30s)
- Fiabilité de l'intégration Copilot (fallback si indisponible)
- Gestion d'erreurs pour échecs IA ou parsing
- Sécurité et isolation des processus Python
- Maintenabilité du code modulaire pour évolutions futures

## Starter Template Evaluation

### Primary Technology Domain

Développement d'extension VS Code basé sur l'analyse des exigences du projet

### Starter Options Considered

- Générateur officiel VS Code (yo code) - version 1.11.16
- antfu/starter-vscode - template alternatif
- microsoft/vscode-extension-samples - exemples officiels

### Selected Starter: Générateur officiel VS Code Extension

**Rationale for Selection:**

Outil officiel Microsoft, version récente, fournit une base solide pour les extensions TypeScript avec configuration de test et linting.

**Initialization Command:**

```bash
npm install -g yo generator-code
yo code
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**

TypeScript avec configuration moderne

**Styling Solution:**

N/A pour extension

**Build Tooling:**

webpack pour bundling et optimisation

**Testing Framework:**

Mocha avec configuration de test

**Code Organization:**

Structure standard d'extension VS Code (src/, out/, package.json)

**Development Experience:**

Débogueur VS Code, rechargement à chaud, scripts npm pour compilation et test

## Décisions Architecturales de Base

### Architecture Générale

L'extension vscode-corriger-extension suit une architecture modulaire avec séparation des responsabilités :

- **Extension VS Code** : Point d'entrée principal, gestion des commandes et intégrations
- **Parsing LaTeX** : Détection et analyse des exercices dans les documents
- **Génération IA** : Utilisation de Copilot pour créer les corrections pédagogiques
- **Vérification Python** : Validation automatique des calculs mathématiques
- **Génération TikZ** : Production de graphiques mathématiques

### Technologies Clés

- **Langage principal** : TypeScript pour l'extension VS Code
- **Calculs mathématiques** : Python avec bibliothèques sympy pour vérifications
- **Parsing LaTeX** : Analyse syntaxique des documents LaTeX
- **Génération graphique** : Code TikZ pour diagrammes mathématiques
- **IA** : Intégration Copilot pour génération de contenu

### Intégrations

- **VS Code API** : Commandes palette, gestion éditeur
- **Copilot Chat** : Interface @corriger pour interactions conversationnelles
- **Sous-processus Python** : Exécution sécurisée des vérifications calculs

### Patterns et Pratiques

- **Modularité** : Séparation claire des composants
- **Gestion d'erreurs** : Récupération gracieuse des échecs IA
- **Performance** : Génération <30s, optimisation des appels IA
- **Sécurité** : Isolation des processus, pas de données sensibles