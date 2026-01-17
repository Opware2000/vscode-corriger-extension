import * as vscode from 'vscode';
import OpenAI from 'openai';
import { MESSAGES, TIMEOUTS, LIMITS } from './constants';
import { logger } from './logger';

// Cache for corrections
interface CorrectionCacheEntry {
    exerciseContent: string;
    correction: string;
    timestamp: number;
}

let correctionCache: Map<string, CorrectionCacheEntry> = new Map();

/**
 * Get configuration value with fallback to default
 */
function getConfig<T>(key: string, defaultValue: T): T {
    const config = vscode.workspace.getConfiguration('vscode-corriger-extension');
    return config.get(key, defaultValue);
}

/**
 * Get OpenAI client instance
 */
function getOpenAIClient(): OpenAI {
    const apiKey = getConfig('openaiApiKey', '');
    if (!apiKey) {
        throw new Error('Clé API OpenAI non configurée. Veuillez définir vscode-corriger-extension.openaiApiKey dans les paramètres.');
    }
    return new OpenAI({
        apiKey: apiKey,
    });
}

/**
 * Generate cache key for exercise content
 */
function generateCacheKey(exerciseContent: string): string {
    // Simple hash for cache key
    let hash = 0;
    for (let i = 0; i < exerciseContent.length; i++) {
        const char = exerciseContent.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
}

/**
 * Get cached correction if available and not expired
 */
function getCachedCorrection(exerciseContent: string): string | null {
    const enableCache = getConfig('enableCorrectionCache', true);
    if (!enableCache) return null;

    const key = generateCacheKey(exerciseContent);
    const entry = correctionCache.get(key);
    if (!entry) return null;

    // Check if cache entry is still valid (e.g., 1 hour)
    const cacheExpiry = 60 * 60 * 1000; // 1 hour
    if (Date.now() - entry.timestamp > cacheExpiry) {
        correctionCache.delete(key);
        return null;
    }

    return entry.correction;
}

/**
 * Cache a correction
 */
function cacheCorrection(exerciseContent: string, correction: string): void {
    const enableCache = getConfig('enableCorrectionCache', true);
    if (!enableCache) return;

    const key = generateCacheKey(exerciseContent);
    const cacheSize = getConfig('correctionCacheSize', LIMITS.CORRECTION_CACHE_SIZE);

    // Remove oldest entries if cache is full
    if (correctionCache.size >= cacheSize) {
        const oldestKey = correctionCache.keys().next().value;
        if (oldestKey) {
            correctionCache.delete(oldestKey);
        }
    }

    correctionCache.set(key, {
        exerciseContent,
        correction,
        timestamp: Date.now()
    });
}

/**
 * Call OpenAI API to generate correction
 */
export async function generateCorrectionWithOpenAI(
    exerciseContent: string,
    cancellationToken?: vscode.CancellationToken
): Promise<string> {
    // Check cache first
    const cached = getCachedCorrection(exerciseContent);
    if (cached) {
        logger.info('Correction récupérée du cache');
        return cached;
    }

    const client = getOpenAIClient();
    const model = getConfig('openaiModel', 'gpt-4');
    const timeout = getConfig('openaiTimeout', TIMEOUTS.OPENAI_REQUEST);

    const prompt = `Vous êtes un professeur de mathématiques expérimenté. Voici un exercice LaTeX :

${exerciseContent}

Générez une correction pédagogique complète et détaillée en français, adaptée au niveau lycée. La correction doit :
- Expliquer chaque étape clairement
- Utiliser un langage accessible aux élèves
- Inclure des justifications mathématiques
- Respecter les notations mathématiques françaises
- Être structurée de manière pédagogique
- Inclure des diagrammes TikZ si nécessaire pour les problèmes de géométrie

Répondez uniquement avec le contenu de la correction en LaTeX valide, sans balises \\begin{correction} ou \\end{correction}.`;

    try {
        logger.info(`Appel à OpenAI ${model} pour génération de correction`);

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 2000,
            temperature: 0.3, // Lower temperature for more consistent math corrections
        }, {
            timeout: timeout
        });

        const correction = response.choices[0]?.message?.content?.trim();
        if (!correction) {
            throw new Error('Réponse vide de OpenAI');
        }

        // Validate LaTeX syntax
        if (!validateLatexSyntax(correction)) {
            logger.warn('LaTeX généré peut contenir des erreurs de syntaxe');
        }

        // Cache the correction
        cacheCorrection(exerciseContent, correction);

        logger.info('Correction générée avec succès via OpenAI');
        return correction;

    } catch (error: any) {
        console.error('Erreur lors de l\'appel à OpenAI:', error);

        if (error.code === 'insufficient_quota') {
            throw new Error('Quota OpenAI épuisé. Vérifiez votre abonnement.');
        }
        if (error.code === 'invalid_api_key') {
            throw new Error('Clé API OpenAI invalide. Vérifiez vos paramètres.');
        }
        if (error.code === 'model_not_found') {
            throw new Error(`Modèle OpenAI ${model} non trouvé.`);
        }
        if (error.name === 'AbortError' || cancellationToken?.isCancellationRequested) {
            throw new Error(MESSAGES.GENERATION_CANCELLED);
        }

        throw new Error(`Erreur OpenAI: ${error.message}`);
    }
}

/**
 * Validate basic LaTeX syntax in correction
 */
function validateLatexSyntax(correction: string): boolean {
    // Basic checks for common LaTeX issues
    const checks = [
        // Check for balanced braces
        (text: string) => (text.match(/\{/g) || []).length === (text.match(/\}/g) || []).length,
        // Check for balanced brackets
        (text: string) => (text.match(/\[/g) || []).length === (text.match(/\]/g) || []).length,
        // Check for balanced parentheses
        (text: string) => (text.match(/\(/g) || []).length === (text.match(/\)/g) || []).length,
        // Check for common LaTeX commands have backslash
        (text: string) => !text.includes(' begin{') && !text.includes(' end{'),
        // Check for escaped characters in math mode
        (text: string) => !/\$.*[^\\]&.*\$/.test(text) // Unescaped & in math mode
    ];

    return checks.every(check => check(correction));
}

/**
 * Clear the correction cache
 */
export function clearCorrectionCache(): void {
    correctionCache.clear();
    logger.info('Cache des corrections vidé');
}