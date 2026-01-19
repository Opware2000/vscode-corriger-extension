import * as vscode from 'vscode';
import * as fs from 'fs';
import { generateCorrectionWithOpenAI } from './openai-integration';
import { callCopilotWithTimeout, isCopilotAvailable } from './copilot-integration';
import { analyzeDocumentStructure, formatCorrectionWithLatexEnvironments } from './latex-parser';
import { MESSAGES, PROMPT_PATHS } from './constants';
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
export function generatePedagogicalPrompt(exerciseContent: string, documentStructure?: import('./latex-parser').DocumentStructure, extensionContext?: vscode.ExtensionContext): string {
    const template = getConfig('pedagogicalPrompt', '') as string;

    let prompt: string;

    if (template && template.trim()) {
        // Replace the placeholder with actual exercise content
        prompt = template.replace('{{exerciseContent}}', exerciseContent);

        // Add document structure context if available
        if (documentStructure) {
            const contextInfo = generateDocumentContext(documentStructure);
            prompt = prompt.replace('{{documentContext}}', contextInfo);
        } else {
            prompt = prompt.replace('{{documentContext}}', '');
        }
    } else {
        // Fallback minimal si configuration vide
        prompt = `Vous êtes un professeur de mathématiques. Corrigez cet exercice LaTeX : ${exerciseContent}`;
    }

    // Append TikZ graphics instructions
    if (extensionContext) {
        try {
            const tikzUri = vscode.Uri.joinPath(extensionContext.extensionUri, ...PROMPT_PATHS.TIKZ_INSTRUCTIONS);
            const tikzInstructions = fs.readFileSync(tikzUri.fsPath, 'utf8');
            prompt += '\n\n' + tikzInstructions;
        } catch (error) {
            logger.error('Could not load TikZ instructions', error as Error);
            throw new Error('TikZ instructions file not found. Cannot generate TikZ graphics.');
        }
    }

    // Append verification instructions
    if (extensionContext) {
        try {
            const verificationUri = vscode.Uri.joinPath(extensionContext.extensionUri, ...PROMPT_PATHS.VERIFICATION_INSTRUCTIONS);
            const verificationInstructions = fs.readFileSync(verificationUri.fsPath, 'utf8');
            prompt += '\n\n' + verificationInstructions;
        } catch (error) {
            logger.warn('Could not load verification instructions', error as Error);
        }
    }

    return prompt;
}

/**
 * Génère un contexte du document pour enrichir les prompts IA
 */
function generateDocumentContext(documentStructure: import('./latex-parser').DocumentStructure): string {
    let context = '';

    if (documentStructure.sections.length > 0) {
        context += `Sections présentes : ${documentStructure.sections.map(s => `${s.type} ${s.number}: ${s.title || 'sans titre'}`).join(', ')}\n`;
    }

    if (documentStructure.theorems.length > 0) {
        context += `Théorèmes/définitions : ${documentStructure.theorems.map(t => `${t.type} ${t.number}: ${t.title || 'sans titre'}`).join(', ')}\n`;
    }

    if (documentStructure.currentSection) {
        context += `Numérotation actuelle - Section: ${documentStructure.currentSection}\n`;
    }

    if (documentStructure.currentTheorem) {
        context += `Numérotation actuelle - Théorème: ${documentStructure.currentTheorem}\n`;
    }

    return context.trim();
}

/**
 * Génère des corrections pour plusieurs exercices en mode batch pour optimiser les performances
 * @param exercises Tableau des contenus d'exercices LaTeX à corriger
 * @param documentContent Le contenu complet du document pour le contexte
 * @param cancellationToken Token d'annulation optionnel
 * @param extensionContext Contexte d'extension pour accéder aux ressources
 * @returns Tableau des corrections formatées en LaTeX
 */
export async function generateBatchCorrections(
    exercises: string[],
    documentContent: string,
    cancellationToken?: vscode.CancellationToken,
    extensionContext?: vscode.ExtensionContext
): Promise<string[]> {
    try {
        logger.info(`Début de génération batch de ${exercises.length} corrections`);

        // Analyser la structure du document pour le contexte
        const documentStructure = analyzeDocumentStructure(documentContent);

        const aiProvider = getConfig('aiProvider', 'openai') as 'openai' | 'copilot';
        let batchResponse: string;

        if (aiProvider === 'copilot') {
            // Vérifier si Copilot est disponible
            const copilotAvailable = await isCopilotAvailable();
            if (!copilotAvailable) {
                throw new Error(MESSAGES.COPILOT_UNAVAILABLE);
            }

            // Créer un prompt batch qui demande toutes les corrections
            const batchPrompt = generateBatchPedagogicalPrompt(exercises, documentStructure, extensionContext);

            const messages = [vscode.LanguageModelChatMessage.User(batchPrompt)];
            const timeout = getConfig('copilotTimeout', 30000);
            const response = await callCopilotWithTimeout(messages, timeout, cancellationToken);
            batchResponse = '';
            for await (const chunk of response.text) {
                batchResponse += chunk;
            }
        } else {
            // Pour OpenAI, générer individuellement (fallback pour compatibilité)
            logger.warn('Mode batch non optimisé pour OpenAI, génération individuelle');
            const corrections: string[] = [];
            for (const exercise of exercises) {
                const correction = await generateCorrection(exercise, documentContent, cancellationToken, extensionContext);
                corrections.push(correction);
            }
            return corrections;
        }

        logger.info('Corrections batch générées avec succès');

        // Parser la réponse batch pour séparer les corrections individuelles
        return parseBatchCorrections(batchResponse, exercises.length);
    } catch (error) {
        const errorMessage = (error as Error).message;
        logger.error('Erreur lors de la génération batch de corrections', error as Error);

        // Re-throw avec messages user-friendly
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

        throw new Error(`Erreur lors de la génération batch de corrections: ${errorMessage}`);
    }
}

/**
 * Génère le prompt pédagogique pour le mode batch avec adaptations françaises
 * @param exercises Tableau des contenus d'exercices LaTeX à corriger
 * @param documentStructure Structure analysée du document
 * @param extensionContext Contexte d'extension pour accéder aux ressources
 * @returns Le prompt complet formaté pour le mode batch
 */
function generateBatchPedagogicalPrompt(exercises: string[], documentStructure?: import('./latex-parser').DocumentStructure, extensionContext?: vscode.ExtensionContext): string {
    let prompt = `Vous êtes un professeur de mathématiques expérimenté enseignant en France. Voici ${exercises.length} exercices LaTeX du programme français de mathématiques :\n\n`;

    exercises.forEach((exercise, index) => {
        prompt += `=== EXERCICE ${index + 1} ===\n${exercise}\n\n`;
    });

    if (documentStructure) {
        const contextInfo = generateDocumentContext(documentStructure);
        if (contextInfo) {
            prompt += `Contexte du document :\n${contextInfo}\n\n`;
        }
    }

    prompt += `Générez une correction pédagogique complète et détaillée pour CHAQUE exercice en français, adaptée au niveau lycée. Chaque correction doit :\n\n`;
    prompt += `- Respecter strictement le programme officiel français de mathématiques\n`;
    prompt += `- Utiliser le vocabulaire mathématique français approprié\n`;
    prompt += `- Expliquer chaque étape clairement et pédagogiquement\n`;
    prompt += `- Utiliser un langage accessible aux élèves de lycée\n`;
    prompt += `- Inclure des justifications mathématiques rigoureuses\n`;
    prompt += `- Respecter les conventions pédagogiques françaises\n`;
    prompt += `- Être structurée de manière logique et progressive\n`;
    prompt += `- Inclure des diagrammes TikZ si nécessaire pour les problèmes de géométrie\n`;
    prompt += `- Fournir des exemples concrets quand cela aide la compréhension\n\n`;

    prompt += `FORMAT DE RÉPONSE :\n`;
    prompt += `Pour chaque exercice, structurez votre réponse avec :\n`;
    prompt += `=== CORRECTION EXERCICE N° ===\n`;
    prompt += `[Contenu de la correction en LaTeX valide, sans \\begin{correction} ou \\end{correction}]\n\n`;

    // Ajouter les instructions TikZ
    if (extensionContext) {
        try {
            const tikzUri = vscode.Uri.joinPath(extensionContext.extensionUri, ...PROMPT_PATHS.TIKZ_INSTRUCTIONS);
            const tikzInstructions = fs.readFileSync(tikzUri.fsPath, 'utf8');
            prompt += '\n\n' + tikzInstructions;
        } catch (error) {
            logger.error('Could not load TikZ instructions', error as Error);
            throw new Error('TikZ instructions file not found. Cannot generate TikZ graphics.');
        }
    }

    // Ajouter les instructions de vérification
    if (extensionContext) {
        try {
            const verificationUri = vscode.Uri.joinPath(extensionContext.extensionUri, ...PROMPT_PATHS.VERIFICATION_INSTRUCTIONS);
            const verificationInstructions = fs.readFileSync(verificationUri.fsPath, 'utf8');
            prompt += '\n\n' + verificationInstructions;
        } catch (error) {
            logger.warn('Could not load verification instructions', error as Error);
        }
    }

    return prompt;
}

/**
 * Parse la réponse batch pour extraire les corrections individuelles
 * @param batchResponse La réponse complète de l'IA
 * @param expectedCount Nombre d'exercices attendu
 * @returns Tableau des corrections individuelles
 */
function parseBatchCorrections(batchResponse: string, expectedCount: number): string[] {
    const corrections: string[] = [];

    // Regex pour trouver les sections de correction
    const correctionRegex = /=== CORRECTION EXERCICE (\d+) ===\s*\n([\s\S]*?)(?==== CORRECTION EXERCICE \d+ ===|$)/g;

    let match;
    while ((match = correctionRegex.exec(batchResponse)) !== null) {
        const exerciseNumber = parseInt(match[1]);
        let correctionContent = match[2].trim();

        // Formater avec environnement LaTeX basique
        correctionContent = formatCorrectionWithLatexEnvironments(correctionContent);

        // Ajouter à la position correcte (les exercices sont 1-indexés)
        corrections[exerciseNumber - 1] = correctionContent;
    }

    // Vérifier que nous avons toutes les corrections attendues
    if (corrections.length !== expectedCount) {
        logger.warn(`Nombre de corrections parsées (${corrections.length}) ne correspond pas au nombre d'exercices (${expectedCount})`);
        // Remplir les corrections manquantes avec une correction d'erreur
        for (let i = 0; i < expectedCount; i++) {
            if (!corrections[i]) {
                corrections[i] = '\\textcolor{red}{Erreur: Correction non générée pour cet exercice}';
            }
        }
    }

    return corrections;
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
    cancellationToken?: vscode.CancellationToken,
    extensionContext?: vscode.ExtensionContext
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

            const prompt = generatePedagogicalPrompt(exerciseContent, documentStructure, extensionContext);

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

        // Formater avec environnement LaTeX basique
        return formatCorrectionWithLatexEnvironments(correction.trim());
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
