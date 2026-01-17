// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getActiveDocumentContent } from './document-access';
import { detectExercises, parseExerciseStructure } from './latex-parser';
import { selectExercise, clearExerciseHighlights } from './exercise-selector';
import { generateCorrection } from './correction-generator';
import { MESSAGES } from './constants';
import { logger } from './logger';
import { CopilotError, RateLimitError, CancellationError, OpenAIError } from './errors';
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

		// Vérifier si l'exercice a déjà une correction
		const structure = parseExerciseStructure(selectedExercise.content);
		if (structure.correction) {
			vscode.window.showInformationMessage(MESSAGES.EXERCISE_ALREADY_CORRECTED);
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
 * Génère et insère la correction dans le document avec prévisualisation
 * @param exercise L'exercice pour lequel générer la correction
 * @param progress Objet de progression pour mettre à jour l'UI
 * @param token Token d'annulation
 */
async function generateAndInsertCorrection(exercise: Exercise, progress: vscode.Progress<{ increment: number; message: string }>, token: vscode.CancellationToken): Promise<void> {
	progress.report({ increment: 0, message: 'Préparation...' });

	let correction = await generateCorrection(exercise.content, token);

	progress.report({ increment: 100, message: 'Prévisualisation...' });

	// Afficher la prévisualisation et demander confirmation
	const previewResult = await showCorrectionPreview(correction);
	if (previewResult === 'cancel') {
		return;
	}
	if (previewResult === 'regenerate') {
		// Régénérer la correction
		progress.report({ increment: 50, message: 'Régénération...' });
		correction = await generateCorrection(exercise.content, token);
		progress.report({ increment: 100, message: 'Prévisualisation...' });

		const secondPreview = await showCorrectionPreview(correction);
		if (secondPreview !== 'insert') {
			return;
		}
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
			editBuilder.insert(insertPosition, '\n' + correction);
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
	const errorMessage = (error as Error).message;
	logger.error('Erreur lors de la génération de correction', error as Error);

	// Gérer les erreurs spécifiques
	if (error instanceof CopilotError) {
		vscode.window.showErrorMessage(MESSAGES.COPILOT_UNAVAILABLE);
	} else if (error instanceof OpenAIError) {
		vscode.window.showErrorMessage(errorMessage);
	} else if (error instanceof RateLimitError) {
		vscode.window.showErrorMessage(MESSAGES.RATE_LIMIT_EXCEEDED);
	} else if (error instanceof CancellationError) {
		vscode.window.showInformationMessage(MESSAGES.GENERATION_CANCELLED);
	} else {
		vscode.window.showErrorMessage(`Erreur lors de la génération de correction: ${errorMessage}`);
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	logger.info('Félicitations, votre extension "vscode-corriger-extension" est maintenant active !');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vscode-corriger-extension.detectExercises', async () => {
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
	});

	context.subscriptions.push(disposable);

	// Commande pour générer une correction
	const generateCorrectionDisposable = vscode.commands.registerCommand('vscode-corriger-extension.generateCorrection', async () => {
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
				await generateAndInsertCorrection(selectedExercise, progress, token);
				logger.info('Correction générée et insérée avec succès');
			} catch (error) {
				handleCorrectionError(error);
			}
		});
	});

	context.subscriptions.push(generateCorrectionDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
