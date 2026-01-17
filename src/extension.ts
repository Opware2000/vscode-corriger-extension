// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getActiveDocumentContent } from './document-access';
import { detectExercises } from './latex-parser';
import { selectExercise, clearExerciseHighlights } from './exercise-selector';
import { generateCorrection } from './correction-generator';
import { MESSAGES } from './constants';
import { logger } from './logger';
import { ExtensionError, CopilotError, RateLimitError, CancellationError, OpenAIError, WrappedError } from './errors';
import { Exercise } from './latex-parser';

/**
 * Valide le document actif et retourne son contenu
 * @returns Le contenu du document ou null si invalide
 */
async function validateAndGetDocumentContent(): Promise<string | null> {
	const content = getActiveDocumentContent();
	if (!content) {
		vscode.window.showInformationMessage(MESSAGES.NO_DOCUMENT);
		return null;
	}
	return content;
}

/**
 * Détecte les exercices dans le contenu et valide qu'il y en a
 * @param content Le contenu LaTeX du document
 * @returns Tableau des exercices détectés
 */
function detectAndValidateExercises(content: string): Exercise[] {
	const exercises = detectExercises(content);
	if (exercises.length === 0) {
		vscode.window.showInformationMessage(MESSAGES.NO_EXERCISES_FOUND);
	}
	return exercises;
}

/**
 * Sélectionne un exercice et le valide
 * @param exercises Liste des exercices disponibles
 * @returns L'exercice sélectionné ou null si annulé/invalide
 */
async function selectAndValidateExercise(exercises: Exercise[]): Promise<Exercise | null> {
	try {
		const selectedExercise = await selectExercise(exercises);
		if (!selectedExercise) {
			return null;
		}

		return selectedExercise;
	} catch (error) {
		logger.error('Erreur lors de la sélection d\'exercice', error as Error);
		vscode.window.showErrorMessage('Erreur lors de la sélection d\'exercice');
		return null;
	}
}

/**
 * Génère une correction pour un exercice avec gestion des tokens d'annulation
 * @param exerciseContent Contenu de l'exercice
 * @param token Token d'annulation
 * @returns La correction générée
 */
async function generateSingleCorrection(exerciseContent: string, documentContent: string, token: vscode.CancellationToken): Promise<string> {
	return await generateCorrection(exerciseContent, documentContent, token);
}

/**
 * Gère le processus de prévisualisation et de régénération de correction
 * @param initialCorrection Correction initiale
 * @param exerciseContent Contenu de l'exercice pour régénération
 * @param progress Objet de progression
 * @param token Token d'annulation
 * @returns La correction finale à insérer ou null si annulé
 */
async function handleCorrectionPreviewAndRegeneration(
	initialCorrection: string,
	exerciseContent: string,
	documentContent: string,
	progress: vscode.Progress<{ increment: number; message: string }>,
	token: vscode.CancellationToken
): Promise<string | null> {
	let correction = initialCorrection;

	while (true) {
		const previewResult = await showCorrectionPreview(correction);

		if (previewResult === 'cancel') {
			return null;
		}

		if (previewResult === 'insert') {
			return correction;
		}

		if (previewResult === 'regenerate') {
			progress.report({ increment: 50, message: 'Régénération...' });
			correction = await generateSingleCorrection(exerciseContent, documentContent, token);
			progress.report({ increment: 100, message: 'Prévisualisation...' });
			// Continue la boucle pour permettre plusieurs régénérations
		}
	}
}

/**
 * Génère et insère la correction dans le document avec prévisualisation
 * @param exercise L'exercice pour lequel générer la correction
 * @param progress Objet de progression pour mettre à jour l'UI
 * @param token Token d'annulation
 */
async function generateAndInsertCorrection(exercise: Exercise, documentContent: string, progress: vscode.Progress<{ increment: number; message: string }>, token: vscode.CancellationToken): Promise<void> {
	progress.report({ increment: 0, message: 'Préparation...' });

	const initialCorrection = await generateSingleCorrection(exercise.content, documentContent, token);

	progress.report({ increment: 100, message: 'Prévisualisation...' });

	const finalCorrection = await handleCorrectionPreviewAndRegeneration(
		initialCorrection,
		exercise.content,
		documentContent,
		progress,
		token
	);

	if (!finalCorrection) {
		return; // Annulé par l'utilisateur
	}

	// Insérer la correction dans le document
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		// Trouver la position de fin de l'exercice (avant \end{exercice})
		const endTagIndex = exercise.content.lastIndexOf('\\end{exercice}');
		const insertPosition = endTagIndex !== -1 ?
			editor.document.positionAt(exercise.start + endTagIndex) :
			editor.document.positionAt(exercise.end);

		await editor.edit(editBuilder => {
			editBuilder.insert(insertPosition, '\n' + finalCorrection);
		});
		vscode.window.showInformationMessage(MESSAGES.CORRECTION_GENERATED);
	}
}

/**
 * Affiche une prévisualisation de la correction et retourne l'action choisie
 * @param correction La correction à prévisualiser
 * @returns 'insert', 'regenerate', ou 'cancel'
 */
async function showCorrectionPreview(correction: string): Promise<'insert' | 'regenerate' | 'cancel'> {
	// Pour les corrections longues, afficher dans le canal de sortie
	const outputChannel = vscode.window.createOutputChannel('Correction Preview');
	outputChannel.clear();
	outputChannel.appendLine('=== PRÉVISUALISATION DE LA CORRECTION ===');
	outputChannel.appendLine(correction);
	outputChannel.show();

	// Demander confirmation avec des boutons
	const result = await vscode.window.showInformationMessage(
		'Correction générée. Consultez l\'onglet "Correction Preview" pour la prévisualisation.',
		{ modal: false },
		'Insérer',
		'Régénérer',
		'Annuler'
	);

	outputChannel.dispose();

	switch (result) {
		case 'Insérer':
			return 'insert';
		case 'Régénérer':
			return 'regenerate';
		default:
			return 'cancel';
	}
}

/**
 * Gère les erreurs de génération de correction
 * @param error L'erreur à traiter
 */
function handleCorrectionError(error: unknown): void {
	// Wrapper l'erreur si ce n'est pas déjà une ExtensionError pour préserver la stack trace
	const processedError = error instanceof ExtensionError ? error : WrappedError.wrap(error, 'Erreur lors de la génération de correction');

	logger.error('Erreur lors de la génération de correction', processedError as Error);

	// Gérer les erreurs spécifiques
	if (processedError instanceof CopilotError) {
		vscode.window.showErrorMessage(MESSAGES.COPILOT_UNAVAILABLE);
	} else if (processedError instanceof OpenAIError) {
		vscode.window.showErrorMessage(processedError.message);
	} else if (processedError instanceof RateLimitError) {
		vscode.window.showErrorMessage(MESSAGES.RATE_LIMIT_EXCEEDED);
	} else if (processedError instanceof CancellationError) {
		vscode.window.showInformationMessage(MESSAGES.GENERATION_CANCELLED);
	} else {
		vscode.window.showErrorMessage(`Erreur lors de la génération de correction: ${processedError.message}`);
	}
}

/**
 * Gère la commande de détection d'exercices
 */
async function handleDetectExercisesCommand(): Promise<void> {
	logger.info('Début de la commande detectExercises');

	// Effacer les anciennes mises en surbrillance
	clearExerciseHighlights();

	// Valider et récupérer le contenu du document
	const content = await validateAndGetDocumentContent();
	if (!content) {
		return;
	}

	// Détecter les exercices dans le contenu
	const exercises = detectExercises(content);

	if (exercises.length === 0) {
		vscode.window.showInformationMessage(MESSAGES.NO_EXERCISES_FOUND);
		logger.info('Aucun exercice détecté');
		return;
	}

	// Afficher le nombre d'exercices détectés
	const message = MESSAGES.EXERCISES_DETECTED(exercises.length);
	vscode.window.showInformationMessage(message);
	logger.info(`${exercises.length} exercices détectés`);

	// Permettre la sélection d'un exercice
	try {
		const selectedExercise = await selectExercise(exercises);
		if (selectedExercise) {
			vscode.window.showInformationMessage(MESSAGES.EXERCISE_SELECTED(selectedExercise.number));
			logger.info(`Exercice sélectionné: ${selectedExercise.number}`);
		}
	} catch (error) {
		logger.error('Erreur lors de la sélection d\'exercice', error as Error);
		vscode.window.showErrorMessage('Erreur lors de la sélection d\'exercice');
	}
}

/**
 * Gère la commande de génération de correction
 */
async function handleGenerateCorrectionCommand(): Promise<void> {
	logger.info('Début de la commande generateCorrection');

	// Valider et récupérer le contenu du document
	const content = await validateAndGetDocumentContent();
	if (!content) {
		return;
	}

	// Détecter et valider les exercices
	const exercises = detectAndValidateExercises(content);
	if (exercises.length === 0) {
		return;
	}

	// Sélectionner et valider un exercice
	const selectedExercise = await selectAndValidateExercise(exercises);
	if (!selectedExercise) {
		return;
	}

	logger.info(`Exercice sélectionné: ${selectedExercise.number}`);

	// Générer la correction avec progression et annulation
	await vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: 'Génération de la correction',
		cancellable: true
	}, async (progress, token) => {
		try {
			await generateAndInsertCorrection(selectedExercise, content, progress, token);
			logger.info('Correction générée et insérée avec succès');
		} catch (error) {
			handleCorrectionError(error);
		}
	});
}

/**
 * Enregistre les commandes de l'extension
 * @param context Contexte d'extension VSCode
 */
function registerCommands(context: vscode.ExtensionContext): void {
	// Commande de détection d'exercices
	const detectExercisesDisposable = vscode.commands.registerCommand(
		'vscode-corriger-extension.detectExercises',
		handleDetectExercisesCommand
	);
	context.subscriptions.push(detectExercisesDisposable);

	// Commande de génération de correction
	const generateCorrectionDisposable = vscode.commands.registerCommand(
		'vscode-corriger-extension.generateCorrection',
		handleGenerateCorrectionCommand
	);
	context.subscriptions.push(generateCorrectionDisposable);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	logger.info('Félicitations, votre extension "vscode-corriger-extension" est maintenant active !');

	// Enregistrer les commandes
	registerCommands(context);
}

// This method is called when your extension is deactivated
export function deactivate() { }
