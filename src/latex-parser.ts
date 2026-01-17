/**
 * Interface représentant un exercice détecté dans le document LaTeX
 */
export interface Exercise {
    number: number; // Numéro de l'exercice (1-based)
    start: number; // Position de début dans le document
    end: number;   // Position de fin dans le document
    content: string; // Contenu de l'exercice
    title?: string; // Titre extrait ou généré pour l'exercice
    status: 'pending' | 'corrected';
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
 * Utilise un parser sécurisé pour éviter les vulnérabilités ReDoS
 * @param content Le contenu LaTeX du document
 * @returns Un tableau d'objets Exercise représentant les exercices détectés
 */
export function detectExercises(content: string): Exercise[] {
    const exercises: Exercise[] = [];
    let index = 0;

    while (index < content.length) {
        // Trouver le début d'un exercice
        const beginIndex = content.indexOf('\\begin{exercice}', index);
        if (beginIndex === -1) break;

        // Trouver la fin correspondante en comptant les niveaux d'imbrication
        let endIndex = findMatchingEndExercice(content, beginIndex);
        if (endIndex === -1) {
            // Si pas de fin trouvée, passer au suivant
            index = beginIndex + 1;
            continue;
        }

        // Extraire le contenu de l'exercice (incluant les balises)
        const exerciseContent = content.substring(beginIndex, endIndex + '\\end{exercice}'.length);
        const exerciseNumber = exercises.length + 1;
        const structure = parseExerciseStructure(exerciseContent);
        const title = structure.enonce ? structure.enonce.substring(0, 50) + (structure.enonce.length > 50 ? '...' : '') : `Exercice ${exerciseNumber}`;

        const start = beginIndex;
        const end = endIndex + '\\end{exercice}'.length;

        // Validation des positions
        if (start < 0 || end <= start || end > content.length) {
            console.warn(`Positions invalides pour l'exercice ${exerciseNumber}: start=${start}, end=${end}`);
            index = beginIndex + 1;
            continue;
        }

        exercises.push({
            number: exerciseNumber,
            start: start,
            end: end,
            content: exerciseContent,
            title: title,
            status: structure.correction ? 'corrected' : 'pending'
        });

        // Continuer après cet exercice
        index = endIndex + 1;
    }

    return exercises;
}

/**
 * Trouve l'index de la balise \end{exercice} correspondante en comptant les niveaux d'imbrication
 * @param content Le contenu à analyser
 * @param beginIndex L'index du \begin{exercice}
 * @returns L'index du \end{exercice} correspondant, ou -1 si non trouvé
 */
function findMatchingEndExercice(content: string, beginIndex: number): number {
    let level = 0;
    let i = beginIndex;

    while (i < content.length) {
        const beginPos = content.indexOf('\\begin{exercice}', i);
        const endPos = content.indexOf('\\end{exercice}', i);

        if (beginPos !== -1 && (endPos === -1 || beginPos < endPos)) {
            // Trouvé un \begin{exercice} avant un \end{exercice}
            level++;
            i = beginPos + '\\begin{exercice}'.length;
        } else if (endPos !== -1) {
            // Trouvé un \end{exercice}
            level--;
            if (level === 0) {
                return endPos;
            }
            i = endPos + '\\end{exercice}'.length;
        } else {
            // Plus de balises trouvées
            break;
        }
    }

    return -1; // Pas de fin correspondante trouvée
}

/**
 * Analyse la structure interne d'un exercice LaTeX pour extraire l'énoncé, la correction, etc.
 * @param exerciseContent Le contenu d'un exercice (entre \begin{exercice} et \end{exercice})
 * @returns Un objet ExerciseStructure avec les éléments extraits
 */
export function parseExerciseStructure(exerciseContent: string): ExerciseStructure {
    const structure: ExerciseStructure = {};

    // Extraire l'énoncé
    const enonceMatch = exerciseContent.match(/\\begin{enonce}([\s\S]*?)\\end{enonce}/);
    if (enonceMatch) {
        structure.enonce = enonceMatch[1].trim();
    }

    // Extraire la correction
    const correctionMatch = exerciseContent.match(/\\begin{correction}([\s\S]*?)\\end{correction}/);
    if (correctionMatch) {
        structure.correction = correctionMatch[1].trim();
    }

    // Calculer le contenu restant en supprimant les balises connues en une seule passe
    let cleanContent = exerciseContent
        .replace(/\\begin{exercice}|\\end{exercice}/g, '')
        .replace(/\\begin{enonce}[\s\S]*?\\end{enonce}/g, '')
        .replace(/\\begin{correction}[\s\S]*?\\end{correction}/g, '')
        .trim();

    if (cleanContent) {
        structure.otherContent = cleanContent;
    }

    return structure;
}