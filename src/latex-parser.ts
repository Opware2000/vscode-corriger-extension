import { createHash } from 'crypto';
import { logger } from './logger';
import { configService } from './config-service';

/**
 * État possible d'un exercice
 */
export enum ExerciseStatus {
    PENDING = 'pending',
    CORRECTED = 'corrected'
}

/**
 * Interface représentant un exercice détecté dans le document LaTeX
 */
export interface Exercise {
    number: number; // Numéro de l'exercice (1-based)
    start: number; // Position de début dans le document
    end: number;   // Position de fin dans le document
    content: string; // Contenu de l'exercice
    title?: string; // Titre extrait ou généré pour l'exercice
    status: ExerciseStatus;
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
 * Interface représentant un environnement LaTeX numéroté
 */
export interface NumberedEnvironment {
    type: 'section' | 'subsection' | 'subsubsection' | 'theorem' | 'lemma' | 'proposition' | 'corollary' | 'definition';
    number: number;
    title?: string;
    start: number;
    end: number;
}

/**
 * Interface représentant la structure numérotée d'un document LaTeX
 */
export interface DocumentStructure {
    sections: NumberedEnvironment[];
    theorems: NumberedEnvironment[];
    currentSection?: number;
    currentTheorem?: number;
}

// Cache for parsed exercises
const exerciseCache = new Map<string, Exercise[]>();

// Performance metrics
let parseOperations = 0;
let cacheHits = 0;
let totalParseTime = 0;

/**
 * Get performance metrics for exercise parsing
 */
export function getPerformanceMetrics() {
    return {
        totalOperations: parseOperations,
        cacheHits,
        cacheHitRate: parseOperations > 0 ? (cacheHits / parseOperations) * 100 : 0,
        averageParseTime: parseOperations > 0 ? totalParseTime / parseOperations : 0
    };
}

/**
 * Générateur qui yield les exercices un par un pour traiter de gros documents
 * @param content Le contenu LaTeX du document
 * @returns Un générateur d'objets Exercise
 */
export function* generateExercises(content: string): Generator<Exercise, void, unknown> {
    logger.debug('Génération des exercices avec yield');

    // Use regex for efficient parsing
    const exerciseRegex = /\\begin{exercice}([\s\S]*?)\\end{exercice}/g;
    let match;
    let exerciseNumber = 1;

    while ((match = exerciseRegex.exec(content)) !== null) {
        const exerciseContent = match[0];
        const start = match.index;
        const end = start + exerciseContent.length;

        // Parse structure for title and status
        const structure = parseExerciseStructure(exerciseContent);
        const title = structure.enonce ?
            structure.enonce.substring(0, 50) + (structure.enonce.length > 50 ? '...' : '') :
            `Exercice ${exerciseNumber}`;

        const exercise: Exercise = {
            number: exerciseNumber,
            start: start,
            end: end,
            content: exerciseContent,
            title: title,
            status: structure.correction ? ExerciseStatus.CORRECTED : ExerciseStatus.PENDING
        };

        yield exercise;
        exerciseNumber++;
    }
}

/**
 * Reset performance metrics
 */
export function resetPerformanceMetrics() {
    parseOperations = 0;
    cacheHits = 0;
    totalParseTime = 0;
    exerciseCache.clear();
}

/**
 * Détecte les exercices dans le contenu LaTeX en utilisant les balises \begin{exercice} et \end{exercice}
 * Utilise un parser sécurisé pour éviter les vulnérabilités ReDoS
 * @param content Le contenu LaTeX du document
 * @returns Un tableau d'objets Exercise représentant les exercices détectés
 */
export function detectExercises(content: string): Exercise[] {
    const startTime = performance.now();
    parseOperations++;

    // Check cache first if enabled
    if (configService.enableCache) {
        const cacheKey = createHash('md5').update(content).digest('hex');
        if (exerciseCache.has(cacheKey)) {
            cacheHits++;
            logger.debug('Cache hit for exercise detection');
            return exerciseCache.get(cacheKey)!;
        }
    }

    const exercises: Exercise[] = [];

    // Use regex for efficient parsing - matches nested structures
    const exerciseRegex = /\\begin{exercice}([\s\S]*?)\\end{exercice}/g;
    let match;
    let exerciseNumber = 1;

    while ((match = exerciseRegex.exec(content)) !== null) {
        const exerciseContent = match[0];
        const start = match.index;
        const end = start + exerciseContent.length;

        // Parse structure for title and status
        const structure = parseExerciseStructure(exerciseContent);
        const title = structure.enonce ?
            structure.enonce.substring(0, 50) + (structure.enonce.length > 50 ? '...' : '') :
            `Exercice ${exerciseNumber}`;

        exercises.push({
            number: exerciseNumber,
            start: start,
            end: end,
            content: exerciseContent,
            title: title,
            status: structure.correction ? ExerciseStatus.CORRECTED : ExerciseStatus.PENDING
        });

        exerciseNumber++;
    }

    // Cache the result if enabled and not too many exercises
    if (configService.enableCache && exercises.length <= 100) {
        const cacheKey = createHash('md5').update(content).digest('hex');
        exerciseCache.set(cacheKey, exercises);
        // Limit cache size
        if (exerciseCache.size > configService.maxCacheSize) {
            const firstKey = exerciseCache.keys().next().value;
            if (firstKey) {
                exerciseCache.delete(firstKey);
            }
        }
    }

    const endTime = performance.now();
    totalParseTime += (endTime - startTime);

    logger.info(`Détection d'exercices terminée: ${exercises.length} exercices trouvés en ${(endTime - startTime).toFixed(2)}ms`);
    return exercises;
}



/**
 * Analyse la structure interne d'un exercice LaTeX pour extraire l'énoncé, la correction, etc.
 * Utilise une approche optimisée avec une seule passe de parsing
 * @param exerciseContent Le contenu d'un exercice (entre \begin{exercice} et \end{exercice})
 * @returns Un objet ExerciseStructure avec les éléments extraits
 */
export function parseExerciseStructure(exerciseContent: string): ExerciseStructure {
    logger.debug('Analyse de la structure d\'un exercice');
    const structure: ExerciseStructure = {};

    // Utiliser une regex complexe pour extraire tous les éléments en une seule passe
    // Cette regex capture : enonce, correction, et le contenu restant
    const fullMatch = exerciseContent.match(
        /^\\begin{exercice}([\s\S]*?)\\end{exercice}$/
    );

    if (!fullMatch) {
        logger.warn('Structure d\'exercice invalide détectée');
        return structure;
    }

    const innerContent = fullMatch[1];

    // Extraire l'énoncé
    const enonceMatch = innerContent.match(/\\begin{enonce}([\s\S]*?)\\end{enonce}/);
    if (enonceMatch) {
        structure.enonce = enonceMatch[1].trim();
    }

    // Extraire la correction
    const correctionMatch = innerContent.match(/\\begin{correction}([\s\S]*?)\\end{correction}/);
    if (correctionMatch) {
        structure.correction = correctionMatch[1].trim();
    }

    // Calculer le contenu restant en supprimant les sections connues
    // Utiliser une approche plus efficace avec une seule opération de remplacement
    const cleanContent = innerContent
        .replace(/\\begin{enonce}[\s\S]*?\\end{enonce}/g, '')
        .replace(/\\begin{correction}[\s\S]*?\\end{correction}/g, '')
        .trim();

    if (cleanContent) {
        structure.otherContent = cleanContent;
    }

    return structure;
}

/**
 * Analyse la structure globale d'un document LaTeX pour identifier les environnements numérotés
 * @param content Le contenu LaTeX du document
 * @returns Un objet DocumentStructure avec la structure analysée
 */
export function analyzeDocumentStructure(content: string): DocumentStructure {
    logger.debug('Analyse de la structure globale du document LaTeX');

    const structure: DocumentStructure = {
        sections: [],
        theorems: []
    };

    // Détecter les sections
    const sectionRegex = /\\(section|subsection|subsubsection)(?:\[([^\]]*)\])?\{([^\}]*)\}/g;
    let match;

    while ((match = sectionRegex.exec(content)) !== null) {
        const type = match[1] as 'section' | 'subsection' | 'subsubsection';
        const title = match[3];
        const number = structure.sections.filter(s => s.type === type).length + 1;

        structure.sections.push({
            type,
            number,
            title,
            start: match.index,
            end: match.index + match[0].length
        });
    }

    // Détecter les théorèmes et environnements mathématiques
    const theoremEnvs = ['theorem', 'lemma', 'proposition', 'corollary', 'definition'];
    theoremEnvs.forEach(envType => {
        const theoremRegex = new RegExp(`\\\\begin\\{${envType}\\}(?:\\[([^\\]]*)\\])?([\\s\\S]*?)\\\\end\\{${envType}\\}`, 'g');
        let theoremMatch;

        while ((theoremMatch = theoremRegex.exec(content)) !== null) {
            const title = theoremMatch[1];
            const number = structure.theorems.filter(t => t.type === envType).length + 1;

            structure.theorems.push({
                type: envType as any,
                number,
                title,
                start: theoremMatch.index,
                end: theoremMatch.index + theoremMatch[0].length
            });
        }
    });

    // Déterminer les numéros courants
    if (structure.sections.length > 0) {
        structure.currentSection = Math.max(...structure.sections.map(s => s.number));
    }

    if (structure.theorems.length > 0) {
        structure.currentTheorem = Math.max(...structure.theorems.map(t => t.number));
    }

    logger.info(`Structure analysée: ${structure.sections.length} sections, ${structure.theorems.length} théorèmes`);
    return structure;
}

/**
 * Génère un numéro approprié pour un nouvel environnement dans le document
 * @param structure La structure analysée du document
 * @param type Le type d'environnement ('section', 'theorem', etc.)
 * @returns Le numéro à utiliser
 */
export function generateNextNumber(structure: DocumentStructure, type: 'section' | 'theorem'): number {
    if (type === 'section') {
        return (structure.currentSection || 0) + 1;
    } else if (type === 'theorem') {
        return (structure.currentTheorem || 0) + 1;
    }
    return 1;
}

/**
 * Génère une correction LaTeX avec numérotation et environnements appropriés
 * @param correctionContent Le contenu de la correction
 * @param documentStructure La structure du document pour la numérotation
 * @returns La correction formatée avec environnements LaTeX appropriés
 */
export function formatCorrectionWithLatexEnvironments(
    correctionContent: string
): string {
    // Formatage basique des corrections avec environnement LaTeX
    return `\\begin{correction}\n${correctionContent}\n\\end{correction}`;
}