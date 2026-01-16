---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments: ["prd.md", "architecture.md"]
---

# vscode-corriger-extension - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for vscode-corriger-extension, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: L'enseignant peut faire détecter automatiquement les exercices LaTeX dans un document ouvert
FR2: L'enseignant peut sélectionner un exercice spécifique pour correction
FR3: L'extension peut identifier les exercices déjà corrigés et les ignorer
FR4: L'extension peut analyser la structure des exercices avec balises `\begin{exercice}` et `\begin{enonce}`
FR5: L'enseignant peut générer des corrections pédagogiques complètes pour les exercices détectés
FR6: L'extension peut adapter le niveau pédagogique au lycée (seconde, première, terminale)
FR7: L'extension peut structurer les corrections avec numérotation et format LaTeX approprié
FR8: L'extension peut respecter la notation mathématique française (probabilités conditionnelles P_A(B))
FR9: L'extension peut vérifier automatiquement l'exactitude de tous les calculs dans les corrections
FR10: L'enseignant peut voir les calculs vérifiés avec indication de validation
FR11: L'extension peut résoudre les équations du second degré avec formule du discriminant
FR12: L'extension peut développer et factoriser des expressions algébriques
FR13: L'enseignant peut lancer la correction via la palette de commandes VS Code
FR14: L'enseignant peut utiliser @corriger dans le chat Copilot pour corriger
FR15: L'extension peut corriger l'exercice au niveau du curseur
FR16: L'extension peut traiter tous les exercices d'un document en une seule opération
FR17: L'extension peut générer automatiquement des graphiques TikZ pour les exercices mathématiques
FR18: L'extension peut créer des arbres de probabilité orientés horizontalement
FR19: L'extension peut produire des tableaux de variation avec signes des dérivées
FR20: L'extension peut intégrer les graphiques dans le format LaTeX des corrections
FR21: L'extension peut informer l'utilisateur quand aucun exercice n'est détecté
FR22: L'extension peut gérer l'indisponibilité de l'IA avec message approprié
FR23: L'extension peut proposer des alternatives quand l'IA n'est pas disponible
FR24: L'extension peut corriger automatiquement les erreurs de format LaTeX généré

### NonFunctional Requirements

- Temps de génération : Chaque correction d'exercice est générée en moins de 30 secondes
- Temps de démarrage : L'extension VS Code se charge et devient opérationnelle en moins de 5 secondes
- Utilisation ressources : L'extension n'augmente pas significativement l'utilisation CPU/mémoire de VS Code
- Temps de réponse UI : Toutes les interactions utilisateur (clics, commandes) répondent en moins de 2 secondes
- Compatibilité VS Code : Extension compatible avec VS Code version 1.70 et supérieure
- Support Copilot : Intégration complète avec GitHub Copilot Chat (@corriger)
- API VS Code : Utilisation correcte et conforme des APIs d'extension VS Code
- Sous-processus Python : Intégration propre et sécurisée avec l'exécution Python pour vérifications calculs
- Gestion versions : Compatibilité maintenue avec les futures versions de VS Code et Copilot
- Stabilité : Extension ne présente pas de crash lors d'utilisation normale
- Gestion d'erreurs : Récupération gracieuse de toutes les erreurs IA avec messages informatifs
- Messages utilisateur : Tous les messages d'erreur sont en français et guident l'utilisateur
- Continuité de service : Extension reste fonctionnelle même en cas d'indisponibilité temporaire de l'IA
- Reprise d'activité : Possibilité de reprendre les corrections après interruption

### Additional Requirements

- Utilisation du starter template officiel VS Code (yo code) pour initialiser le projet
- Architecture modulaire avec séparation des responsabilités : Extension VS Code, Parsing LaTeX, Génération IA, Vérification Python, Génération TikZ
- Technologies clés : TypeScript pour l'extension, Python avec sympy pour vérifications mathématiques, Copilot pour génération IA, TikZ pour graphiques
- Intégrations : VS Code API pour commandes et éditeur, Copilot Chat pour @corriger, sous-processus Python pour calculs
- Patterns et pratiques : Modularité, gestion d'erreurs gracieuse, performance optimisée, sécurité et isolation des processus

### FR Coverage Map

FR1: Epic 1 - Détection automatique des exercices LaTeX
FR2: Epic 1 - Sélection d'un exercice spécifique
FR3: Epic 1 - Identification des exercices déjà corrigés
FR4: Epic 1 - Analyse de la structure des exercices avec balises
FR5: Epic 2 - Génération de corrections pédagogiques complètes
FR6: Epic 2 - Adaptation au niveau pédagogique lycée
FR7: Epic 2 - Structuration avec format LaTeX approprié
FR8: Epic 2 - Respect de la notation mathématique française
FR9: Epic 3 - Vérification automatique de l'exactitude des calculs
FR10: Epic 3 - Affichage des calculs vérifiés avec validation
FR11: Epic 3 - Résolution d'équations du second degré
FR12: Epic 3 - Développement et factorisation d'expressions
FR13: Epic 4 - Lancement via palette de commandes VS Code
FR14: Epic 4 - Utilisation de @corriger dans Copilot
FR15: Epic 4 - Correction au niveau du curseur
FR16: Epic 4 - Traitement de tous les exercices du document
FR17: Epic 5 - Génération automatique de graphiques TikZ
FR18: Epic 5 - Création d'arbres de probabilité horizontaux
FR19: Epic 5 - Production de tableaux de variation
FR20: Epic 5 - Intégration des graphiques dans les corrections
FR21: Epic 6 - Information quand aucun exercice détecté
FR22: Epic 6 - Gestion de l'indisponibilité de l'IA
FR23: Epic 6 - Proposition d'alternatives si IA indisponible
FR24: Epic 6 - Correction automatique d'erreurs LaTeX

## Epic List

### Epic 1: Détection et Analyse des Exercices
Permet à l'enseignant de détecter automatiquement les exercices LaTeX dans un document ouvert et d'analyser leur structure.
**FRs couverts:** FR1, FR2, FR3, FR4

### Epic 2: Génération de Corrections Pédagogiques
Permet à l'enseignant de générer des corrections pédagogiques complètes adaptées au niveau lycée avec format LaTeX approprié.
**FRs couverts:** FR5, FR6, FR7, FR8

### Epic 3: Vérification Mathématique Automatique
Permet à l'extension de vérifier automatiquement l'exactitude des calculs et de résoudre des équations complexes.
**FRs couverts:** FR9, FR10, FR11, FR12

### Epic 4: Intégration Avancée VS Code et Copilot
Permet à l'enseignant d'utiliser l'extension via différentes méthodes : palette de commandes, Copilot @corriger, curseur, traitement global.
**FRs couverts:** FR13, FR14, FR15, FR16

### Epic 5: Production de Graphiques Mathématiques
Permet à l'extension de générer automatiquement des graphiques TikZ (arbres de probabilité, tableaux de variation) intégrés aux corrections.
**FRs couverts:** FR17, FR18, FR19, FR20

### Epic 6: Gestion d'Erreurs et Robustesse
Permet à l'extension de gérer gracieusement les erreurs, indisponibilité IA, et de maintenir la continuité de service.
**FRs couverts:** FR21, FR22, FR23, FR24

## Epic 1: Détection et Analyse des Exercices

Permet à l'enseignant de détecter automatiquement les exercices LaTeX dans un document ouvert et d'analyser leur structure.

### Story 1.0: Configuration initiale du projet avec starter template VS Code

As a développeur,
I want configurer le projet initial avec le starter template officiel VS Code,
So that j'ai une base solide pour développer l'extension.

**Acceptance Criteria:**

**Given** un nouveau projet
**When** j'exécute la commande yo code
**Then** le projet est initialisé avec la structure TypeScript standard
**And** les dépendances et configurations de base sont installées

### Story 1.1: Détection automatique des exercices LaTeX

As an enseignant de maths,
I want détecter automatiquement tous les exercices dans un document LaTeX ouvert,
So that je peux voir rapidement quels exercices nécessitent une correction.

**Acceptance Criteria:**

**Given** un document LaTeX ouvert contenant des balises `\begin{exercice}`
**When** l'extension analyse le document
**Then** elle identifie et liste tous les exercices présents
**And** elle analyse leur structure avec balises `\begin{exercice}` et `\begin{enonce}`

### Story 1.2: Sélection d'un exercice spécifique

As an enseignant de maths,
I want sélectionner un exercice spécifique dans la liste détectée,
So that je peux me concentrer sur un exercice particulier.

**Acceptance Criteria:**

**Given** une liste d'exercices détectés
**When** je sélectionne un exercice dans la liste
**Then** l'exercice est mis en surbrillance dans le document
**And** l'extension se prépare à corriger cet exercice spécifique

### Story 1.3: Identification des exercices déjà corrigés

As an enseignant de maths,
I want que l'extension identifie automatiquement les exercices déjà corrigés,
So that je ne corrige pas deux fois le même exercice.

**Acceptance Criteria:**

**Given** un document avec des exercices corrigés (balises `\begin{correction}`)
**When** l'extension analyse le document
**Then** elle marque les exercices déjà corrigés comme ignorés
**And** elle ne propose pas de les corriger à nouveau

## Epic 2: Génération de Corrections Pédagogiques

Permet à l'enseignant de générer des corrections pédagogiques complètes adaptées au niveau lycée avec format LaTeX approprié.

### Story 2.1: Génération de corrections pédagogiques complètes

As an enseignant de maths,
I want générer des corrections pédagogiques complètes pour les exercices détectés,
So that j'obtiens des solutions détaillées et pédagogiques.

**Acceptance Criteria:**

**Given** un exercice détecté sans correction
**When** l'extension génère une correction
**Then** elle produit une correction complète et pédagogique
**And** elle insère les balises `\begin{correction}` et `\end{correction}` appropriées

### Story 2.2: Adaptation au niveau lycée

As an enseignant de maths,
I want que les corrections soient adaptées au niveau lycée (seconde, première, terminale),
So that le contenu correspond au programme et au niveau des élèves.

**Acceptance Criteria:**

**Given** un exercice avec indication de niveau
**When** l'extension génère la correction
**Then** elle adapte le vocabulaire et les concepts au niveau spécifié
**And** elle utilise les notations appropriées au programme français

### Story 2.3: Structuration avec format LaTeX approprié

As an enseignant de maths,
I want que les corrections soient structurées avec numérotation et format LaTeX approprié,
So that elles s'intègrent parfaitement dans le document.

**Acceptance Criteria:**

**Given** une correction générée
**When** elle est insérée dans le document
**Then** elle respecte la numérotation LaTeX existante
**And** elle utilise les environnements LaTeX corrects pour les maths

### Story 2.4: Respect de la notation mathématique française

As an enseignant de maths,
I want que les corrections respectent la notation mathématique française,
So that elles correspondent aux conventions utilisées en France.

**Acceptance Criteria:**

**Given** un exercice nécessitant des probabilités conditionnelles
**When** l'extension génère la correction
**Then** elle utilise P_A(B) au lieu de P(B|A)
**And** elle respecte toutes les conventions françaises de notation

## Epic 3: Vérification Mathématique Automatique

Permet à l'extension de vérifier automatiquement l'exactitude des calculs et de résoudre des équations complexes.

### Story 3.1: Vérification automatique de l'exactitude des calculs

As an enseignant de maths,
I want que l'extension vérifie automatiquement l'exactitude de tous les calculs dans les corrections,
So that je suis assuré de la fiabilité des solutions générées.

**Acceptance Criteria:**

**Given** une correction générée avec des calculs
**When** l'extension vérifie les calculs
**Then** elle valide chaque étape mathématique
**And** elle signale toute erreur détectée

### Story 3.2: Affichage des calculs vérifiés avec validation

As an enseignant de maths,
I want voir les calculs vérifiés avec indication de validation,
So that je peux identifier facilement les parties validées.

**Acceptance Criteria:**

**Given** une correction avec calculs vérifiés
**When** elle est affichée
**Then** les calculs corrects sont marqués comme validés
**And** les calculs erronés sont mis en évidence

### Story 3.3: Résolution d'équations du second degré

As an enseignant de maths,
I want que l'extension résolve les équations du second degré avec formule du discriminant,
So that les solutions quadratiques sont correctement calculées.

**Acceptance Criteria:**

**Given** une équation du second degré
**When** l'extension la résout
**Then** elle applique correctement la formule du discriminant
**And** elle fournit toutes les solutions réelles ou complexes

### Story 3.4: Développement et factorisation d'expressions

As an enseignant de maths,
I want que l'extension développe et factorise des expressions algébriques,
So that les manipulations algébriques sont précises.

**Acceptance Criteria:**

**Given** une expression algébrique à développer ou factoriser
**When** l'extension la traite
**Then** elle applique les règles algébriques correctement
**And** elle vérifie le résultat obtenu

## Epic 4: Intégration Avancée VS Code et Copilot

Permet à l'enseignant d'utiliser l'extension via différentes méthodes : palette de commandes, Copilot @corriger, curseur, traitement global.

### Story 4.1: Lancement via palette de commandes VS Code

As an enseignant de maths,
I want lancer la correction via la palette de commandes VS Code,
So that j'ai un accès rapide et standard à la fonctionnalité.

**Acceptance Criteria:**

**Given** un document LaTeX ouvert
**When** j'ouvre la palette de commandes et tape "corriger"
**Then** l'extension apparaît dans les suggestions
**And** elle lance la correction du document complet

### Story 4.2: Utilisation de @corriger dans Copilot

As an enseignant de maths,
I want utiliser @corriger dans le chat Copilot pour corriger,
So that je peux interagir naturellement avec l'IA.

**Acceptance Criteria:**

**Given** Copilot activé dans VS Code
**When** je tape "@corriger" dans le chat
**Then** l'extension traite la requête
**And** elle corrige selon le contexte (document, sélection, curseur)

### Story 4.3: Correction au niveau du curseur

As an enseignant de maths,
I want que l'extension corrige l'exercice au niveau du curseur,
So that je peux corriger précisément un exercice spécifique.

**Acceptance Criteria:**

**Given** mon curseur à l'intérieur d'un exercice
**When** je lance la correction
**Then** seule l'exercice contenant le curseur est corrigé
**And** les autres exercices restent inchangés

### Story 4.4: Traitement de tous les exercices du document

As an enseignant de maths,
I want traiter tous les exercices d'un document en une seule opération,
So that je peux corriger en lot pour gagner du temps.

**Acceptance Criteria:**

**Given** un document avec plusieurs exercices
**When** je lance la correction globale
**Then** tous les exercices non corrigés sont traités
**And** les corrections sont insérées dans l'ordre approprié

## Epic 5: Production de Graphiques Mathématiques

Permet à l'extension de générer automatiquement des graphiques TikZ (arbres de probabilité, tableaux de variation) intégrés aux corrections.

### Story 5.1: Génération automatique de graphiques TikZ

As an enseignant de maths,
I want que l'extension génère automatiquement des graphiques TikZ pour les exercices mathématiques,
So that les corrections incluent des représentations visuelles.

**Acceptance Criteria:**

**Given** un exercice nécessitant un graphique
**When** l'extension génère la correction
**Then** elle produit le code TikZ approprié
**And** elle l'intègre dans la correction LaTeX

### Story 5.2: Création d'arbres de probabilité horizontaux

As an enseignant de maths,
I want que l'extension crée des arbres de probabilité orientés horizontalement,
So that les représentations probabilistes sont claires.

**Acceptance Criteria:**

**Given** un exercice de probabilités avec arbre
**When** l'extension génère le graphique
**Then** l'arbre est orienté horizontalement
**And** les probabilités sont correctement positionnées

### Story 5.3: Production de tableaux de variation

As an enseignant de maths,
I want que l'extension produise des tableaux de variation avec signes des dérivées,
So that l'analyse fonctionnelle est visualisée.

**Acceptance Criteria:**

**Given** une fonction à analyser
**When** l'extension crée le tableau de variation
**Then** il montre les intervalles et signes des dérivées
**And** il respecte le format LaTeX standard

### Story 5.4: Intégration des graphiques dans les corrections

As an enseignant de maths,
I want que les graphiques soient intégrés dans le format LaTeX des corrections,
So that ils se compilent correctement avec le document.

**Acceptance Criteria:**

**Given** un graphique TikZ généré
**When** il est inséré dans la correction
**Then** il utilise les environnements LaTeX appropriés
**And** il se compile sans erreur dans le document

## Epic 6: Gestion d'Erreurs et Robustesse

Permet à l'extension de gérer gracieusement les erreurs, indisponibilité IA, et de maintenir la continuité de service.

### Story 6.1: Information quand aucun exercice détecté

As an enseignant de maths,
I want que l'extension m'informe quand aucun exercice n'est détecté,
So that je comprends pourquoi rien ne se passe.

**Acceptance Criteria:**

**Given** un document sans balises `\begin{exercice}`
**When** l'extension analyse le document
**Then** elle affiche un message clair "Aucun exercice détecté"
**And** elle propose des suggestions pour corriger le format

### Story 6.2: Gestion de l'indisponibilité de l'IA

As an enseignant de maths,
I want que l'extension gère l'indisponibilité de l'IA avec un message approprié,
So that je sais ce qui se passe et quoi faire.

**Acceptance Criteria:**

**Given** l'IA Copilot indisponible
**When** l'extension tente de générer une correction
**Then** elle affiche un message informatif en français
**And** elle propose des alternatives ou un retry

### Story 6.3: Proposition d'alternatives si IA indisponible

As an enseignant de maths,
I want que l'extension propose des alternatives quand l'IA n'est pas disponible,
So that je peux continuer à travailler.

**Acceptance Criteria:**

**Given** IA indisponible
**When** l'extension gère l'erreur
**Then** elle suggère de réessayer plus tard
**And** elle propose des méthodes alternatives si disponibles

### Story 6.4: Correction automatique d'erreurs LaTeX

As an enseignant de maths,
I want que l'extension corrige automatiquement les erreurs de format LaTeX généré,
So that les corrections sont toujours valides.

**Acceptance Criteria:**

**Given** une correction avec erreur LaTeX
**When** l'extension détecte l'erreur
**Then** elle corrige automatiquement le format
**And** elle s'assure que le document reste compilable

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

## Epic {{N}}: {{epic_title_N}}

{{epic_goal_N}}

<!-- Repeat for each story (M = 1, 2, 3...) within epic N -->

### Story {{N}}.{{M}}: {{story_title_N_M}}

As a {{user_type}},
I want {{capability}},
So that {{value_benefit}}.

**Acceptance Criteria:**

<!-- for each AC on this story -->

**Given** {{precondition}}
**When** {{action}}
**Then** {{expected_outcome}}
**And** {{additional_criteria}}

<!-- End story repeat -->