# Story 4.2: utilisation-de-corriger-dans-copilot

Status: completed

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an enseignant de maths,
I want utiliser @corriger dans le chat Copilot pour corriger,
So that je peux interagir naturellement avec l'IA.

## Acceptance Criteria

1. **Given** Copilot activé dans VS Code
**When** je tape "@corriger" dans le chat
**Then** l'extension traite la requête
**And** elle corrige selon le contexte (document, sélection, curseur)

## Tasks / Subtasks

- [x] Enregistrer le participant de chat "corriger" dans package.json
   - [x] Ajouter la section chatParticipants dans contributes
   - [x] Définir l'id "corriger" avec nom et description
- [x] Implémenter le handler de chat participant dans extension.ts
   - [x] Importer vscode/chat
   - [x] Enregistrer le participant avec vscode.chat.registerChatParticipant
   - [x] Implémenter la fonction de gestion des requêtes de chat
- [x] Détecter le contexte de correction (document, sélection, curseur)
   - [x] Analyser le document actif pour exercices LaTeX
   - [x] Détecter la sélection de texte si présente
   - [x] Utiliser la position du curseur si pas de sélection
- [x] Intégrer avec la logique de correction existante
   - [x] Réutiliser detectExercises et generateCorrection
   - [x] Adapter les réponses pour le format chat
- [x] Gérer les erreurs et messages utilisateur dans le chat
   - [x] Messages d'erreur en français
   - [x] Gestion de l'indisponibilité de Copilot
   - [x] Messages de progression et confirmation

## Dev Notes

- Relevant architecture patterns and constraints: VS Code Chat API, Chat Participants, Event-driven architecture
- Source tree components to touch: package.json (contributes.chatParticipants), src/extension.ts (registerChatParticipant), src/copilot-integration.ts (si nécessaire)
- Testing standards summary: Unit tests pour le handler de chat, tests d'intégration avec Copilot Chat, tests E2E pour les scénarios utilisateur

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming): Extension des capacités de l'extension principale sans modification majeure de l'architecture
- Detected conflicts or variances (with rationale): Nouvelle fonctionnalité, pas de conflits détectés

### References

- Cite all technical details with source paths and sections, e.g. [Source: docs/<file>.md#Section]
- [Source: https://code.visualstudio.com/api/extension-guides/chat#chat-participants]
- [Source: src/extension.ts - logique de correction existante]
- [Source: src/latex-parser.ts - détection d'exercices]
- [Source: src/correction-generator.ts - génération de corrections]

## Change Log

- Implémentation du participant de chat "corriger" pour utilisation dans Copilot Chat (2026-01-18)

## Dev Agent Record

### Agent Model Used

x-ai/grok-code-fast-1

### Debug Log References

### Completion Notes List

- Implémenté le participant de chat "corriger" dans package.json avec la section chatParticipants
- Ajouté la fonction handleChatParticipantRequest pour traiter les requêtes de chat
- Enregistré le participant de chat dans la fonction activate de extension.ts
- Intégré la détection de contexte (sélection/cursor) et réutilisé la logique existante detectExercises/generateCorrection
- Géré les erreurs en français avec messages appropriés
- Tests unitaires créés pour valider la fonctionnalité

### File List

- package.json: Ajout de la section chatParticipants pour enregistrer le participant "corriger"
- src/extension.ts: Implémentation du handler de chat participant et enregistrement dans activate()
- src/test/suites/chat-participant.test.ts: Tests unitaires pour valider le participant de chat