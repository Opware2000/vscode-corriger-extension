# Instructions de génération automatique des graphiques TikZ

## Génération automatique de graphiques mathématiques

Lorsque l'exercice nécessite une représentation graphique (tableaux de variation, arbres de probabilité, diagrammes), vous devez générer automatiquement le code TikZ approprié et l'intégrer dans la correction LaTeX.

### Détection des besoins graphiques :
- Tableaux de variation de fonctions
- Arbres de probabilité (horizontaux ou verticaux)
- Diagrammes géométriques simples
- Représentations de suites ou séries

### Format TikZ requis :
Utilisez le package tkz-tab pour les tableaux de variation et tkz-tree pour les arbres de probabilité.

### Déclarations de packages LaTeX :
Si le document LaTeX n'inclut pas déjà les packages nécessaires, ajoutez les déclarations suivantes au début de votre correction :
- \usepackage{tikz}
- \usepackage{tkz-tab} (pour les tableaux de variation)
- \usepackage{tkz-tree} (pour les arbres de probabilité)
- \usetikzlibrary{calc,arrows.meta} (si nécessaire pour des fonctionnalités avancées)

#### Exemples de code TikZ :

**Tableau de variation simple :**
```latex
\begin{center}
  \begin{tikzpicture}[scale=0.7]
  \tkzTabInit[lgt=2,espcl=2]{$x$/1, $f'(x)$/1, $f(x)$/2}{$-\infty$, $2$, $+\infty$}
  \tkzTabLine{, -, z, -, +, }
  \tkzTabVar{+/, -/$-1$, +/}
  \end{tikzpicture}
\end{center}
```

**Tableau de variation avec dérivée du second degré :**
```latex
\begin{center}
  \begin{tikzpicture}[scale=0.7]
  \tkzTabInit[lgt=2,espcl=2]{$x$/1, $f'(x)$/1, $f(x)$/2}{$-\infty$, $-1$, $2$, $+\infty$}
  \tkzTabLine{, +, z, -, z, +, }
  \tkzTabVar{-/, +/$12$, -/$-15$, +/}
  \end{tikzpicture}
\end{center}
```

**Arbre de probabilité horizontal :**
```latex
\begin{center}
  \begin{tikzpicture}[scale=0.8]
  \tkzTreeInit
  \tkzTreeSetLevelSpacing{2cm}
  \tkzTreeSetNodeSpacing{1.5cm}
  \tkzTreeGrowFromLeft
  \tkzTreeNode{$0.3$}{\node[draw,circle](a){A};}
  \tkzTreeEdge
  \tkzTreeNode{$0.7$}{\node[draw,circle](b){B};}
  \tkzTreeEdgeFrom(a)
  \tkzTreeNode{$0.6$}{\node[draw,circle](c){C};}
  \tkzTreeEdge
  \tkzTreeNode{$0.4$}{\node[draw,circle](d){D};}
  \end{tikzpicture}
\end{center}
```

### Intégration dans la correction :
- Placez le code TikZ dans un environnement center
- Utilisez scale=0.7 pour les tableaux de variation
- Assurez-vous que le code est valide LaTeX
- Commentez le graphique : % Graphique TikZ généré automatiquement

### Instructions impératives :
- **Détectez automatiquement** les besoins graphiques dans l'exercice
- **Générez le code TikZ approprié** pour chaque graphique requis
- **Intégrez le code** dans la correction LaTeX au bon endroit
- **Vérifiez la validité** du code TikZ généré
- **Utilisez les exemples** comme modèles pour la syntaxe correcte</content>
