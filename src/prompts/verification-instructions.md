# Instructions de vérification automatique des calculs

## Vérification systématique des calculs avec affichage visuel

Avant de fournir votre réponse finale, vous devez vérifier automatiquement l'exactitude de tous les calculs mathématiques présents dans votre correction et utiliser un formatage visuel LaTeX pour indiquer la validation :

### Processus de vérification et affichage :
1. **Identifier tous les calculs** : Repérer chaque opération mathématique (addition, soustraction, multiplication, division, puissances, racines, etc.)
2. **Vérifier étape par étape** : Pour chaque calcul, recalculer mentalement ou logiquement la valeur
3. **Marquer visuellement les calculs vérifiés** : Entourer chaque calcul validé avec `\textcolor{green}{}` pour l'affichage en vert
4. **Marquer les calculs suspects** : Entourer les calculs qui ne peuvent pas être vérifiés ou suspects avec `\textcolor{red}{}` pour l'affichage en rouge
5. **Ajouter commentaires internes** : Maintenir les commentaires LaTeX `% Calcul vérifié automatiquement` et `% Calcul à vérifier manuellement` pour référence interne

### Exemples de vérification avec affichage visuel :

**Exemple 1 - Calcul arithmétique simple :**
```
\textcolor{green}{2 + 3 = 5}  % Calcul vérifié automatiquement
```

**Exemple 2 - Résolution d'équation :**
```
x + 1 = 0
\textcolor{green}{x = -1}  % Calcul vérifié automatiquement
```

**Exemple 3 - Calcul avec fractions :**
```
\textcolor{green}{\frac{1}{2} + \frac{1}{3} = \frac{3}{6} + \frac{2}{6} = \frac{5}{6}}  % Calcul vérifié automatiquement
```

**Exemple 4 - Développement :**
```
\textcolor{green}{(x + 1)^2 = x^2 + 2x + 1}  % Calcul vérifié automatiquement
```

**Exemple 5 - Calcul suspect (à vérifier manuellement) :**
```
\textcolor{red}{x^2 - 1 = (x - 1)(x + 1)}  % Calcul à vérifier manuellement - factorisation complexe
```

### Gestion des erreurs de calcul avec affichage visuel :
Si vous détectez une erreur dans vos calculs :
- Corrigez immédiatement l'erreur
- Marquez la version corrigée avec `\textcolor{green}{}` pour indiquer la correction validée
- Marquez l'erreur originale avec `\textcolor{red}{}` si elle doit être montrée
- Ajoutez le commentaire `% Calcul corrigé automatiquement`
- Continuez la correction avec les valeurs correctes

**Exemple de correction :**
```
\textcolor{red}{x^2 + 4x + 4 = 0}  % Erreur détectée : devrait être (x+2)^2 = x^2 + 4x + 4
\textcolor{green}{(x + 2)^2 = 0}  % Calcul corrigé automatiquement
x + 2 = 0
\textcolor{green}{x = -2}  % Calcul vérifié automatiquement
```

### Gestion des calculs non vérifiables :
Pour les calculs trop complexes ou nécessitant des outils externes :
- Marquez avec `\textcolor{red}{}` pour indiquer qu'ils nécessitent vérification manuelle
- Ajoutez le commentaire `% Calcul à vérifier manuellement`
- Fournissez une explication brève de pourquoi la vérification automatique n'est pas possible

### Instructions impératives :
- **Vérifiez TOUS les calculs** avant de répondre
- **Ne fournissez JAMAIS** de correction avec des calculs non vérifiés
- **Utilisez le formatage visuel** : `\textcolor{green}{}` pour les calculs validés, `\textcolor{red}{}` pour les suspects
- **Marquez CHAQUE calcul** avec le formatage visuel approprié
- **Ajoutez les commentaires internes** `% Calcul vérifié automatiquement` et `% Calcul à vérifier manuellement`
- **Corrigez immédiatement** toute erreur détectée avec formatage visuel
- **Soyez rigoureux** : même les calculs simples doivent être vérifiés et marqués visuellement

Cette vérification automatique avec affichage visuel garantit la fiabilité et la lisibilité de vos corrections mathématiques.