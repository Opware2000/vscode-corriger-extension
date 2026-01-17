import * as vscode from 'vscode';
import { createHash } from 'crypto';
import { LIMITS } from './constants';
import { logger } from './logger';

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
            status: structure.correction ? 'corrected' : 'pending'
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
    const enableCache = getConfig('enableCache', true);
    if (enableCache) {
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
            status: structure.correction ? 'corrected' : 'pending'
        });

        exerciseNumber++;
    }

    // Cache the result if enabled and not too many exercises
    if (enableCache && exercises.length <= 100) {
        const cacheKey = createHash('md5').update(content).digest('hex');
        exerciseCache.set(cacheKey, exercises);
        // Limit cache size
        const maxCacheSize = getConfig('maxCacheSize', LIMITS.EXERCISE_CACHE_SIZE);
        if (exerciseCache.size > maxCacheSize) {
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
 * Get configuration value with fallback to default
 */
function getConfig<T>(key: string, defaultValue: T): T {
    const config = vscode.workspace.getConfiguration('vscode-corriger-extension');
    return config.get(key, defaultValue);
}


/**
 * Analyse la structure interne d'un exercice LaTeX pour extraire l'énoncé, la correction, etc.
 * @param exerciseContent Le contenu d'un exercice (entre \begin{exercice} et \end{exercice})
 * @returns Un objet ExerciseStructure avec les éléments extraits
 */
export function parseExerciseStructure(exerciseContent: string): ExerciseStructure {
    logger.debug('Analyse de la structure d\'un exercice');
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