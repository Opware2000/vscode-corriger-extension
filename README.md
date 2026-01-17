# VSCode Corriger Extension

Extension VSCode pour la correction automatique d'exercices LaTeX utilisant l'IA (OpenAI ou GitHub Copilot).

## Fonctionnalités

Cette extension permet de :

- **Détecter automatiquement les exercices** dans les documents LaTeX utilisant les balises `\begin{exercice}` et `\end{exercice}`
- **Sélectionner un exercice** à corriger via une interface interactive
- **Générer des corrections pédagogiques** complètes et détaillées en français avec OpenAI GPT-4 ou GitHub Copilot
- **Prévisualiser les corrections** avant insertion avec option de régénération
- **Insérer automatiquement** les corrections dans le document
- **Mettre en surbrillance** les exercices détectés dans l'éditeur
- **Cache intelligent** des corrections pour éviter les appels API répétés

### Commandes disponibles

- `vscode-corriger-extension.detectExercises` : Détecte et met en surbrillance tous les exercices du document
- `vscode-corriger-extension.generateCorrection` : Génère une correction pour l'exercice sélectionné

## Prérequis

- **VSCode** version 1.108.1 ou supérieure
- **Clé API OpenAI** valide (GPT-4 recommandé) ou **GitHub Copilot** activé
- Documents en format LaTeX avec des exercices structurés

## Installation

1. Installez l'extension depuis le marketplace VSCode
2. Configurez votre clé API OpenAI dans les paramètres de l'extension
3. Ouvrez un document LaTeX contenant des exercices

## Utilisation

### Structure des exercices LaTeX

Les exercices doivent suivre cette structure :

```latex
\begin{exercice}
\begin{enonce}
Votre énoncé d'exercice ici...
\end{enonce}
\begin{correction}
La correction sera générée ici
\end{correction}
\end{exercice}
```

### Workflow de correction

1. **Détection** : Utilisez `Ctrl+Shift+P` → "Détecter les exercices LaTeX"
2. **Sélection** : Choisissez l'exercice à corriger dans la liste
3. **Génération** : Lancez la génération de correction avec `Ctrl+Shift+C` (Mac: `Cmd+Shift+C`)
4. **Prévisualisation** : Consultez la correction générée dans l'onglet "Correction Preview"
5. **Validation** : Choisissez d'insérer, régénérer ou annuler
6. **Insertion** : La correction est automatiquement insérée dans le document

## Configuration

L'extension propose plusieurs paramètres configurables :

### `vscode-corriger-extension.openaiApiKey`
- **Type** : `string`
- **Défaut** : `""`
- **Description** : Clé API OpenAI pour la génération de corrections
- **⚠️ Sécurité** : Cette clé API est stockée en clair dans les paramètres VSCode. Pour une sécurité optimale, considérez l'utilisation de variables d'environnement ou de services de gestion de secrets. Évitez de partager votre configuration contenant cette clé.

### `vscode-corriger-extension.openaiModel`
- **Type** : `string`
- **Options** : `"gpt-5.2"`, `"gpt-5.2-pro"`, `"gpt-5.1"`, `"gpt-5"`, `"gpt-5-mini"`, `"gpt-5-nano"`, `"gpt-4.1"`, `"gpt-4o"`, `"gpt-4o-mini"`, `"gpt-4-turbo"`, `"gpt-4"`, `"gpt-3.5-turbo"`
- **Défaut** : `"gpt-5.2"`
- **Description** : Modèle OpenAI à utiliser pour la génération de corrections

### `vscode-corriger-extension.openaiTimeout`
- **Type** : `number`
- **Défaut** : `30000`
- **Description** : Timeout en millisecondes pour les appels à OpenAI

### `vscode-corriger-extension.enableCorrectionCache`
- **Type** : `boolean`
- **Défaut** : `true`
- **Description** : Activer le cache des corrections générées

### `vscode-corriger-extension.correctionCacheSize`
- **Type** : `number`
- **Défaut** : `50`
- **Description** : Taille maximale du cache des corrections

### `vscode-corriger-extension.aiProvider`
- **Type** : `string`
- **Options** : `"openai"`, `"copilot"`
- **Défaut** : `"openai"`
- **Description** : Fournisseur d'IA à utiliser pour la génération de corrections. Copilot est recommandé pour une meilleure sécurité car il utilise l'abonnement GitHub Copilot de l'utilisateur sans clé API externe.

### `vscode-corriger-extension.copilotModel`
- **Type** : `string`
- **Options** : `"gpt-5.2"`, `"gpt-5.2-codex"`, `"gpt-5.1"`, `"gpt-5.1-codex"`, `"gpt-5.1-codex-mini"`, `"gpt-5.1-codex-max"`, `"gpt-5"`, `"gpt-5-mini"`, `"gpt-5-codex"`, `"gpt-4.1"`, `"gpt-4o"`, `"gpt-4-turbo"`, `"gpt-4"`, `"gpt-3.5-turbo"`, `"claude-haiku-4.5"`, `"claude-opus-4.1"`, `"claude-opus-4.5"`, `"claude-sonnet-4"`, `"claude-sonnet-4.5"`, `"gemini-3-flash"`, `"gemini-3-pro"`, `"grok-code-fast"`, `"raptor-mini"`
- **Défaut** : `"gpt-5.2"`
- **Description** : Modèle Copilot à utiliser pour la génération de corrections

### `vscode-corriger-extension.enableCache`
- **Type** : `boolean`
- **Défaut** : `true`
- **Description** : Activer le cache des exercices parsés

### `vscode-corriger-extension.maxCacheSize`
- **Type** : `number`
- **Défaut** : `10`
- **Description** : Taille maximale du cache des exercices

## Architecture technique

### Modules principaux

- **`extension.ts`** : Point d'entrée et gestion des commandes
- **`latex-parser.ts`** : Parsing et détection des exercices LaTeX
- **`exercise-selector.ts`** : Interface de sélection des exercices
- **`correction-generator.ts`** : Génération des corrections via OpenAI
- **`openai-integration.ts`** : Intégration avec l'API OpenAI et cache
- **`document-access.ts`** : Accès au contenu des documents
- **`constants.ts`** : Constantes et messages de l'application

### Fonctionnalités de performance

- **Cache intelligent** des exercices parsés et des corrections générées
- **Validation de syntaxe LaTeX** pour assurer la qualité des corrections
- **Parsing optimisé** avec expressions régulières
- **Métriques de performance** intégrées
- **Annulation des opérations** longues
- **Support multi-modèles** OpenAI (GPT-4, GPT-4 Turbo, GPT-3.5)

### Sécurité

- Validation des entrées utilisateur
- Gestion sécurisée des timeouts
- Protection contre les attaques ReDoS
- Messages d'erreur informatifs

## Tests

L'extension inclut une suite complète de tests :

```bash
npm run test:unit      # Tests unitaires
npm run test:e2e       # Tests end-to-end
npm run test:integration # Tests d'intégration
```

## Développement

### Prérequis de développement

```bash
npm install
npm run compile
```

### Scripts disponibles

- `npm run compile` : Compilation TypeScript
- `npm run watch` : Compilation en mode watch
- `npm run lint` : Vérification du code
- `npm run test` : Exécution des tests
- `npm run package` : Création du package d'extension

## Problèmes connus

- L'extension nécessite une clé API OpenAI valide pour fonctionner
- Les documents très volumineux peuvent nécessiter plus de temps de traitement
- La génération de corrections peut être limitée par les quotas OpenAI
- Les coûts d'API OpenAI peuvent s'accumuler selon l'utilisation

## Support et contribution

Pour signaler un problème ou contribuer :

1. Vérifiez les [issues existantes](https://github.com/your-repo/issues)
2. Créez une nouvelle issue avec les détails du problème
3. Pour les contributions, créez une pull request

## Licence

Cette extension est distribuée sous licence MIT.

---

**Profitez de corrections automatisées pour vos exercices LaTeX !**
