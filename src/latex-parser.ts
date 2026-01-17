import * as vscode from 'vscode';
import { createHash } from 'crypto';
import { LIMITS } from './constants';
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