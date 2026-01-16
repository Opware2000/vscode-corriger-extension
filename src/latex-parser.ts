/**
 * Interface représentant un exercice détecté dans le document LaTeX
 */
export interface Exercise {
    start: number; // Position de début dans le document
    end: number;   // Position de fin dans le document
    content: string; // Contenu de l'exercice
}

/**
 * Interface représentant la structure analysée d'un exercice
 */
export interface ExerciseStructure {
    enonce?: string;
    correction?: string;
    otherContent?: string;
}

/**
 * Détecte les exercices dans le contenu LaTeX en utilisant les balises \begin{exercice} et \end{exercice}
 * @param content Le contenu LaTeX du document
 * @returns Un tableau d'objets Exercise représentant les exercices détectés
 */
export function detectExercises(content: string): Exercise[] {
    const exercises: Exercise[] = [];
    const regex = /\\begin{exercice}([\s\S]*?)\\end{exercice}/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        exercises.push({
            start: match.index,
            end: match.index + match[0].length,
            content: match[0]
        });
    }

    return exercises;
}

/**
 * Analyse la structure interne d'un exercice LaTeX pour extraire l'énoncé, la correction, etc.
 * @param exerciseContent Le contenu d'un exercice (entre \begin{exercice} et \end{exercice})
 * @returns Un objet ExerciseStructure avec les éléments extraits
 */
export function parseExerciseStructure(exerciseContent: string): ExerciseStructure {
    const structure: ExerciseStructure = {};

    // Utiliser des groupes de capture nommés pour une meilleure lisibilité
    const enonceMatch = exerciseContent.match(/\\begin{enonce}([\s\S]*?)\\end{enonce}/);
    if (enonceMatch) {
        structure.enonce = enonceMatch[1].trim();
    }

    const correctionMatch = exerciseContent.match(/\\begin{correction}([\s\S]*?)\\end{correction}/);
    if (correctionMatch) {
        structure.correction = correctionMatch[1].trim();
    }

    // Calculer le contenu restant de manière plus efficace
    let cleanContent = exerciseContent
        .replace(/\\begin{exercice}/, '')
        .replace(/\\end{exercice}/, '')
        .replace(/\\begin{enonce}[\s\S]*?\\end{enonce}/, '')
        .replace(/\\begin{correction}[\s\S]*?\\end{correction}/, '')
        .trim();

    if (cleanContent) {
        structure.otherContent = cleanContent;
    }

    return structure;
}