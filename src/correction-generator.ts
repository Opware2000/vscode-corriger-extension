import * as vscode from 'vscode';
import { callCopilotWithTimeout } from './copilot-integration';

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

export async function generateCorrection(exerciseContent: string): Promise<string> {
    const prompt = generatePedagogicalPrompt(exerciseContent);
    const messages = [vscode.LanguageModelChatMessage.User(prompt)];

    try {
        const response = await callCopilotWithTimeout(messages, 30000);
        let correction = '';
        for await (const fragment of response.text) {
            correction += fragment;
        }
        return `\\begin{correction}\n${correction.trim()}\n\\end{correction}`;
    } catch (error) {
        throw new Error(`Erreur lors de la génération de correction: ${(error as Error).message}`);
    }
}