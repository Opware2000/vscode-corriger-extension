import * as vscode from 'vscode';
import { generateCorrectionWithOpenAI } from './openai-integration';
import { callCopilotWithTimeout, isCopilotAvailable } from './copilot-integration';
import { MESSAGES } from './constants';
import { logger } from './logger';

/**
 * Get configuration value with fallback to default
 */
function getConfig<T>(key: string, defaultValue: T): T {
    const config = vscode.workspace.getConfiguration('vscode-corriger-extension');
    return config.get(key, defaultValue);
}

/**
 * Génère une correction pour un exercice en utilisant l'IA configurée
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

        const aiProvider = getConfig('aiProvider', 'openai') as 'openai' | 'copilot';
        let correction: string;

        if (aiProvider === 'copilot') {
            // Vérifier si Copilot est disponible
            const copilotAvailable = await isCopilotAvailable();
            if (!copilotAvailable) {
                throw new Error(MESSAGES.COPILOT_UNAVAILABLE);
            }

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

            const messages = [vscode.LanguageModelChatMessage.User(prompt)];
            const timeout = getConfig('copilotTimeout', 30000);
            const response = await callCopilotWithTimeout(messages, timeout, cancellationToken);
            correction = '';
            for await (const chunk of response.text) {
                correction += chunk;
            }
        } else {
            // Utiliser OpenAI
            correction = await generateCorrectionWithOpenAI(exerciseContent, cancellationToken);
        }

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