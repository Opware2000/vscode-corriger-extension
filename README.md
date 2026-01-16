# Correcteur LaTeX - Extension VS Code

Extension VS Code qui fournit un agent de correction personnalisé `@corriger` pour corriger des exercices LaTeX de niveau lycée dans Copilot Chat.

## Fonctionnalités

- **Participant de chat `@corriger`** : Invocable directement dans Copilot Chat
- **Correction d'exercices LaTeX** : Spécialisé dans les exercices de mathématiques niveau lycée
- **Génération de diagrammes TikZ** : Tableaux de variations, arbres de probabilité, etc.
- **Format standardisé** : Correction au format LaTeX avec environnements `\begin{exercice}` et `\begin{correction}`

## Utilisation

1. Installez l'extension
2. Ouvrez Copilot Chat dans VS Code
3. Tapez `@corriger` suivi de votre requête
4. Collez l'exercice LaTeX à corriger

### Exemple

```
@corriger Corrige cet exercice :

\begin{exercice}
    Résoudre l'équation : $x^2 - 5x + 6 = 0$
\end{exercice}
```

## Installation

### À partir du code source

1. Clonez ce dépôt
2. Installez les dépendances : `npm install`
3. Compilez l'extension : `npm run compile`
4. Appuyez sur F5 pour lancer en mode debug

### Installation locale (VSIX)

1. Packagez l'extension : `npx vsce package`
2. Installez le fichier `.vsix` : Extensions > ⋯ > Install from VSIX...

## Prérequis

- VS Code 1.90.0 ou supérieur
- GitHub Copilot activé

## Développement

```bash
# Installation des dépendances
npm install

# Compilation
npm run compile

# Watch mode
npm run watch

# Package
npm run package
```
