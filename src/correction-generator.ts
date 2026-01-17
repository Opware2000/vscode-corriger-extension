import * as vscode from 'vscode';
import { callCopilotWithTimeout } from './copilot-integration';
import { MESSAGES } from './constants';

/**
 * Génère un prompt pédagogique pour la correction d'exercice
 * @param exerciseContent Le contenu de l'exercice LaTeX
 * @returns Le prompt formaté pour Copilot
 */
export function generatePedagogicalPrompt(exerciseContent: string): string {
    return `Vous êtes un professeur de mathématiques expérimenté. Voici un exercice LaTeX :

${exerciseContent}

Générez une correction pédagogique complète et détaillée en français, adaptée au niveau lycée. La correction doit :
- Expliquer chaque étape clairement
- Utiliser un langage accessible aux élèves
- Inclure des justifications mathématiques
- Respecter les notations mathématiques françaises
- Être structurée de manière pédagogique

Répondez uniquement avec le contenu de la correction, sans balises LaTeX supplémentaires.`;
}

/**
 * Génère une correction pour un exercice en utilisant Copilot
 * @param exerciseContent Le contenu de l'exercice LaTeX
 * @param cancellationToken Token d'annulation optionnel
 * @returns La correction formatée en LaTeX
 */
export async function generateCorrection(
    exerciseContent: string,
    cancellationToken?: vscode.CancellationToken
): Promise<string> {
    const prompt = generatePedagogicalPrompt(exerciseContent);
    const messages = [vscode.LanguageModelChatMessage.User(prompt)];

    try {
        console.log('Début de génération de correction pour un exercice');
        const response = await callCopilotWithTimeout(messages, undefined, cancellationToken);
        let correction = '';
        for await (const fragment of response.text) {
            if (cancellationToken?.isCancellationRequested) {
                throw new Error(MESSAGES.GENERATION_CANCELLED);
            }
            correction += fragment;
        }
        console.log('Correction générée avec succès');
        return `\\begin{correction}\n${correction.trim()}\n\\end{correction}`;
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Erreur lors de la génération de correction:', errorMessage);

        // Re-throw with more user-friendly messages
        if (errorMessage.includes('Copilot not available')) {
            throw new Error(MESSAGES.COPILOT_UNAVAILABLE);
        }
        if (errorMessage.includes('rate limit')) {
            throw new Error(MESSAGES.RATE_LIMIT_EXCEEDED);
        }
        if (errorMessage.includes('cancelled')) {
            throw new Error(MESSAGES.GENERATION_CANCELLED);
        }

        throw new Error(`Erreur lors de la génération de correction: ${errorMessage}`);
    }
}