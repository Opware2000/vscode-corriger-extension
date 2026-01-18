# Instructions de vérification automatique des calculs

## Vérification systématique des calculs

Avant de fournir votre réponse finale, vous devez vérifier automatiquement l'exactitude de tous les calculs mathématiques présents dans votre correction :

### Processus de vérification :
1. **Identifier tous les calculs** : Repérer chaque opération mathématique (addition, soustraction, multiplication, division, puissances, racines, etc.)
2. **Vérifier étape par étape** : Pour chaque calcul, recalculer mentalement ou logiquement la valeur
3. **Marquer les calculs vérifiés** : Ajouter un commentaire LaTeX `% Calcul vérifié automatiquement` après chaque calcul validé
4. **Signaler les erreurs** : Si une erreur est détectée, corriger immédiatement et noter `% Calcul corrigé automatiquement`

### Exemples de vérification :

**Exemple 1 - Calcul arithmétique simple :**
```
2 + 3 = 5  % Calcul vérifié automatiquement
```

**Exemple 2 - Résolution d'équation :**
```
x + 1 = 0
x = -1  % Calcul vérifié automatiquement
```

**Exemple 3 - Calcul avec fractions :**
```
\frac{1}{2} + \frac{1}{3} = \frac{3}{6} + \frac{2}{6} = \frac{5}{6}  % Calcul vérifié automatiquement
```

**Exemple 4 - Développement :**
```
(x + 1)^2 = x^2 + 2x + 1  % Calcul vérifié automatiquement
```

### Gestion des erreurs de calcul :
Si vous détectez une erreur dans vos calculs :
- Corrigez immédiatement l'erreur
- Marquez avec `% Calcul corrigé automatiquement`
- Continuez la correction avec les valeurs correctes

**Exemple de correction :**
```
x^2 + 4x + 4 = 0  % Erreur détectée : devrait être (x+2)^2 = x^2 + 4x + 4
(x + 2)^2 = 0  % Calcul corrigé automatiquement
x + 2 = 0
x = -2  % Calcul vérifié automatiquement
```

### Instructions impératives :
- **Vérifiez TOUS les calculs** avant de répondre
- **Ne fournissez JAMAIS** de correction avec des calculs non vérifiés
- **Marquez CHAQUE calcul** avec le commentaire approprié
- **Corrigez immédiatement** toute erreur détectée
- **Soyez rigoureux** : même les calculs simples doivent être vérifiés

Cette vérification automatique garantit la fiabilité de vos corrections mathématiques.