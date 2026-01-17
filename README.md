# VSCode Corriger Extension

Extension VSCode pour la correction automatique d'exercices LaTeX utilisant l'IA Copilot.

## Fonctionnalités

Cette extension permet de :

- **Détecter automatiquement les exercices** dans les documents LaTeX utilisant les balises `\begin{exercice}` et `\end{exercice}`
- **Sélectionner un exercice** à corriger via une interface interactive
- **Générer des corrections pédagogiques** complètes et détaillées en français
- **Insérer automatiquement** les corrections dans le document
- **Mettre en surbrillance** les exercices détectés dans l'éditeur

### Commandes disponibles

- `vscode-corriger-extension.detectExercises` : Détecte et met en surbrillance tous les exercices du document
- `vscode-corriger-extension.generateCorrection` : Génère une correction pour l'exercice sélectionné

## Prérequis

- **VSCode** version 1.108.1 ou supérieure
- **GitHub Copilot Chat** installé et activé dans VSCode
- Documents en format LaTeX avec des exercices structurés

## Installation

1. Installez l'extension depuis le marketplace VSCode
2. Assurez-vous que GitHub Copilot Chat est installé et configuré
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
3. **Génération** : Lancez la génération de correction
4. **Insertion** : La correction est automatiquement insérée dans le document

## Configuration

L'extension propose plusieurs paramètres configurables :

### `vscode-corriger-extension.copilotTimeout`
- **Type** : `number`
- **Défaut** : `30000`
- **Description** : Timeout en millisecondes pour les appels à Copilot

### `vscode-corriger-extension.rateLimitRequests`
- **Type** : `number`
- **Défaut** : `10`
- **Description** : Nombre maximum de requêtes Copilot par minute

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
- **`correction-generator.ts`** : Génération des corrections via Copilot
- **`copilot-integration.ts`** : Intégration avec l'API Copilot
- **`document-access.ts`** : Accès au contenu des documents
- **`constants.ts`** : Constantes et messages de l'application

### Fonctionnalités de performance

- **Cache intelligent** des exercices parsés
- **Rate limiting** pour éviter la surcharge des API
- **Parsing optimisé** avec expressions régulières
- **Métriques de performance** intégrées
- **Annulation des opérations** longues

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

- L'extension nécessite GitHub Copilot Chat pour fonctionner
- Les documents très volumineux peuvent nécessiter plus de temps de traitement
- La génération de corrections peut être limitée par les quotas Copilot

## Support et contribution

Pour signaler un problème ou contribuer :

1. Vérifiez les [issues existantes](https://github.com/your-repo/issues)
2. Créez une nouvelle issue avec les détails du problème
3. Pour les contributions, créez une pull request

## Licence

Cette extension est distribuée sous licence MIT.

---

**Profitez de corrections automatisées pour vos exercices LaTeX !**
