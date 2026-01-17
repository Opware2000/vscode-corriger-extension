import * as vscode from 'vscode';
import { generateCorrectionWithOpenAI } from './openai-integration';
import { callCopilotWithTimeout, isCopilotAvailable } from './copilot-integration';
import { analyzeDocumentStructure, formatCorrectionWithLatexEnvironments } from './latex-parser';
import { MESSAGES, FRENCH_MATH_NOTATIONS, FRENCH_MATH_VOCABULARY } from './constants';
import { logger } from './logger';
import { getConfig } from './config';


/**
 * Génère le prompt pédagogique pour Copilot avec adaptations françaises
 * @param exerciseContent Le contenu de l'exercice LaTeX à corriger
 * @returns Le prompt complet formaté pour Copilot incluant les instructions pédagogiques françaises
 * @example
 * ```typescript
 * const prompt = generatePedagogicalPrompt("\\begin{exercice}\nRésoudre x + 1 = 0\n\\end{exercice}");
 * // Retourne un prompt détaillé avec vocabulaire mathématique français
 * ```
 */
export function generatePedagogicalPrompt(exerciseContent: string): string {
    const config = vscode.workspace.getConfiguration('vscode-corriger-extension');
    const template = config.get('pedagogicalPrompt', '') as string;

    if (template && template.trim()) {
        // Replace the placeholder with actual exercise content
        return template.replace('{{exerciseContent}}', exerciseContent);
    }

    // Fallback to default prompt if configuration is empty
    return `Vous êtes un professeur de mathématiques expérimenté enseignant en France. Voici un exercice LaTeX du programme français de mathématiques :

${exerciseContent}

Générez une correction pédagogique complète et détaillée en français, adaptée au niveau lycée. La correction doit :

- Respecter strictement le programme officiel français de mathématiques
- Utiliser le vocabulaire mathématique français approprié :
  * ${FRENCH_MATH_VOCABULARY.CALCULATE} au lieu de "calculate"
  * ${FRENCH_MATH_VOCABULARY.SIMPLIFY} au lieu de "simplify"
  * ${FRENCH_MATH_VOCABULARY.RESOLVE} au lieu de "solve"
  * ${FRENCH_MATH_VOCABULARY.DEMONSTRATE} au lieu de "prove"
  * ${FRENCH_MATH_VOCABULARY.CONCLUDE} au lieu de "conclude"
  * ${FRENCH_MATH_VOCABULARY.THEREFORE} au lieu de "therefore"
  * ${FRENCH_MATH_VOCABULARY.BECAUSE} au lieu de "because"

- Respecter les notations mathématiques françaises :
  * Probabilités conditionnelles : ${FRENCH_MATH_NOTATIONS.PROBABILITY_CONDITIONAL}
  * Espérance : ${FRENCH_MATH_NOTATIONS.EXPECTED_VALUE}
  * Variance : ${FRENCH_MATH_NOTATIONS.VARIANCE}
  * Écart-type : ${FRENCH_MATH_NOTATIONS.STANDARD_DEVIATION}

- Expliquer chaque étape clairement et pédagogiquement
- Utiliser un langage accessible aux élèves de lycée
- Inclure des justifications mathématiques rigoureuses
- Respecter les conventions pédagogiques françaises
- Être structurée de manière logique et progressive
- Inclure des diagrammes TikZ si nécessaire pour les problèmes de géométrie
- Fournir des exemples concrets quand cela aide la compréhension

Répondez uniquement avec le contenu de la correction en code LaTeX valide, sans balises \\begin{correction} ou \\end{correction}.`;
}

/**
 * Génère une correction pour un exercice en utilisant l'IA configurée
 * @param exerciseContent Le contenu de l'exercice LaTeX
 * @param cancellationToken Token d'annulation optionnel
 * @returns La correction formatée en LaTeX
 */
export async function generateCorrection(
    exerciseContent: string,
    documentContent?: string,
    cancellationToken?: vscode.CancellationToken
): Promise<string> {
    try {
        logger.info('Début de génération de correction pour un exercice');

        // Analyser la structure du document si fournie pour la numérotation
        let documentStructure = undefined;
        if (documentContent) {
            documentStructure = analyzeDocumentStructure(documentContent);
        }

        const aiProvider = getConfig('aiProvider', 'openai') as 'openai' | 'copilot';
        let correction: string;

        if (aiProvider === 'copilot') {
            // Vérifier si Copilot est disponible
            const copilotAvailable = await isCopilotAvailable();
            if (!copilotAvailable) {
                throw new Error(MESSAGES.COPILOT_UNAVAILABLE);
            }

            const prompt = generatePedagogicalPrompt(exerciseContent);

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

        // Formater avec environnements LaTeX appropriés si structure disponible
        if (documentStructure) {
            return formatCorrectionWithLatexEnvironments(correction.trim(), documentStructure);
        } else {
            return `\\begin{correction}\n${correction.trim()}\n\\end{correction}`;
        }
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