import * as vscode from 'vscode';
import { generateCorrectionWithOpenAI } from './openai-integration';
import { MESSAGES } from './constants';
import { logger } from './logger';

/**
 * Génère une correction pour un exercice en utilisant OpenAI
 * @param exerciseContent Le contenu de l'exercice LaTeX
 * @param cancellationToken Token d'annulation optionnel
 * @returns La correction formatée en LaTeX
 */
export async function generateCorrection(
    exerciseContent: string,
    cancellationToken?: vscode.CancellationToken
): Promise<string> {
    try {
        logger.info('Début de génération de correction pour un exercice');
        const correction = await generateCorrectionWithOpenAI(exerciseContent, cancellationToken);
        logger.info('Correction générée avec succès');
        return `\\begin{correction}\n${correction.trim()}\n\\end{correction}`;
    } catch (error) {
        const errorMessage = (error as Error).message;
        logger.error('Erreur lors de la génération de correction', error as Error);

        // Re-throw with more user-friendly messages
        if (errorMessage.includes('Clé API OpenAI non configurée')) {
            throw new Error('Configuration OpenAI requise. Veuillez définir votre clé API dans les paramètres.');
        }
        if (errorMessage.includes('Quota OpenAI épuisé')) {
            throw new Error('Quota OpenAI épuisé. Vérifiez votre abonnement OpenAI.');
        }
        if (errorMessage.includes('Clé API OpenAI invalide')) {
            throw new Error('Clé API OpenAI invalide. Vérifiez vos paramètres.');
        }
        if (errorMessage.includes('cancelled')) {
            throw new Error(MESSAGES.GENERATION_CANCELLED);
        }

        throw new Error(`Erreur lors de la génération de correction: ${errorMessage}`);
    }
}