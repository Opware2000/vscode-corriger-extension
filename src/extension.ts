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

// Contexte d'extension global pour accéder aux ressources
let extensionContext: vscode.ExtensionContext;

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
 * Génère et insère la correction dans le document
 * @param exercise L'exercice pour lequel générer la correction
 * @param documentContent Contenu du document
 * @param progress Objet de progression pour mettre à jour l'UI
 * @param token Token d'annulation
 * @param preview Si true, affiche une prévisualisation avant insertion
 */
async function generateAndInsertCorrection(exercise: Exercise, documentContent: string, progress: vscode.Progress<{ increment: number; message: string }>, token: vscode.CancellationToken, preview: boolean = true): Promise<void> {
	if (preview) {
		// Mode avec prévisualisation (pour correction unique)
		const initialCorrection = await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: 'Génération de la correction',
			cancellable: true
		}, async (innerProgress, innerToken) => {
			innerProgress.report({ increment: 0, message: 'Préparation...' });
			const correction = await generateSingleCorrection(exercise.content, documentContent, innerToken);
			innerProgress.report({ increment: 100, message: 'Prévisualisation...' });
			return correction;
		});

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
			const endTagIndex = exercise.content.lastIndexOf('\\end{exercice}');
			const insertPosition = endTagIndex !== -1 ?
				editor.document.positionAt(exercise.start + endTagIndex) :
				editor.document.positionAt(exercise.end);

			await editor.edit(editBuilder => {
				editBuilder.insert(insertPosition, '\n' + finalCorrection);
			});
			vscode.window.showInformationMessage(MESSAGES.CORRECTION_GENERATED);
		}
	} else {
		// Mode sans prévisualisation (pour correction globale)
		const correction = await generateSingleCorrection(exercise.content, documentContent, token);

		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const endTagIndex = exercise.content.lastIndexOf('\\end{exercice}');
			const insertPosition = endTagIndex !== -1 ?
				editor.document.positionAt(exercise.start + endTagIndex) :
				editor.document.positionAt(exercise.end);

			await editor.edit(editBuilder => {
				editBuilder.insert(insertPosition, '\n' + correction);
			});
		}
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
 * Gère les requêtes du participant de chat "corriger"
 * @param request La requête du chat
 * @param context Le contexte du chat
 * @param response Le stream de réponse
 * @param token Token d'annulation
 */
async function handleChatParticipantRequest(
	_request: vscode.ChatRequest,
	_context: vscode.ChatContext,
	response: vscode.ChatResponseStream,
	token: vscode.CancellationToken
): Promise<void> {
	try {
		// Analyser le contexte de correction (document, sélection, curseur)
		const documentContent = getActiveDocumentContent();
		if (!documentContent) {
			response.markdown('Aucun document actif trouvé. Ouvrez un fichier LaTeX contenant des exercices.');
			return;
		}

		// Détecter les exercices
		const exercises = detectExercises(documentContent);
		if (exercises.length === 0) {
			response.markdown('Aucun exercice LaTeX détecté dans le document actif.');
			return;
		}

		// Analyser la requête pour déterminer le contexte
		let targetExercise: Exercise | null = null;

		// Vérifier s'il y a une sélection active
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor && !activeEditor.selection.isEmpty) {
			// Utiliser la sélection
			const selectedText = activeEditor.document.getText(activeEditor.selection);
			// Trouver l'exercice contenant la sélection
			targetExercise = exercises.find(ex =>
				ex.start <= activeEditor.document.offsetAt(activeEditor.selection.start) &&
				ex.end >= activeEditor.document.offsetAt(activeEditor.selection.end)
			) || null;
		} else if (activeEditor) {
			// Utiliser la position du curseur
			const cursorPosition = activeEditor.selection.active;
			const cursorOffset = activeEditor.document.offsetAt(cursorPosition);
			// Trouver l'exercice le plus proche
			targetExercise = exercises.find(ex => ex.start <= cursorOffset && ex.end >= cursorOffset) || null;
		}

		if (!targetExercise) {
			response.markdown(`Exercices détectés (${exercises.length}), mais aucun n'est sélectionné ou sous le curseur. Utilisez la sélection ou placez le curseur dans un exercice.`);
			return;
		}

		// Générer la correction
		response.markdown(`Génération de la correction pour l'exercice ${targetExercise.number}...`);

		const correction = await generateCorrection(targetExercise.content, documentContent, token);

		response.markdown(`**Correction de l'exercice ${targetExercise.number} :**\n\n${correction}`);

	} catch (error) {
		logger.error('Erreur dans le participant de chat corriger', error as Error);
		response.markdown('Erreur lors de la génération de correction. Vérifiez les logs pour plus de détails.');
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

	// Gérer les erreurs spécifiques avec messages améliorés
	if (processedError instanceof CopilotError) {
		vscode.window.showErrorMessage('L\'IA Copilot n\'est pas disponible. Vérifiez que GitHub Copilot est activé et connecté.');
	} else if (processedError instanceof OpenAIError) {
		vscode.window.showErrorMessage(`Erreur OpenAI: ${processedError.message}. Vérifiez votre clé API et connexion.`);
	} else if (processedError instanceof RateLimitError) {
		vscode.window.showErrorMessage('Limite de taux dépassée. Veuillez attendre avant de réessayer.');
	} else if (processedError instanceof CancellationError) {
		vscode.window.showInformationMessage('Génération annulée par l\'utilisateur.');
	} else {
		vscode.window.showErrorMessage(`Erreur inattendue lors de la génération: ${processedError.message}`);
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
			await generateAndInsertCorrection(selectedExercise, content, progress, token, true);
			logger.info('Correction générée et insérée avec succès');
		} catch (error) {
			handleCorrectionError(error);
		}
	});
}

/**
 * Gère la commande de correction globale du document
 */
async function handleCorrigerCommand(): Promise<void> {
	logger.info('Début de la commande corriger');

	// Valider et récupérer le contenu du document
	const content = await validateAndGetDocumentContent();
	if (!content) {
		return;
	}

	// Détecter les exercices
	const exercises = detectExercises(content);
	if (exercises.length === 0) {
		vscode.window.showInformationMessage(MESSAGES.NO_EXERCISES_FOUND);
		return;
	}

	logger.info(`${exercises.length} exercices détectés pour correction globale`);

	// Générer les corrections pour tous les exercices avec progression
	await vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: 'Génération des corrections',
		cancellable: true
	}, async (progress, token) => {
		let completed = 0;
		let processed = 0;
		const total = exercises.length;

		for (let i = 0; i < exercises.length; i++) {
			const exercise = exercises[i];

			if (token.isCancellationRequested) {
				vscode.window.showInformationMessage('Correction annulée par l\'utilisateur');
				break;
			}

			progress.report({
				increment: 0,
				message: `Correction de l'exercice ${exercise.number}...`
			});

			// Vérifier si l'exercice est déjà corrigé
			const nextExerciseStart = exercises[i + 1]?.start ?? content.length;
			const correctionStart = content.indexOf('\\begin{correction}', exercise.end);
			if (correctionStart !== -1 && correctionStart < nextExerciseStart) {
				logger.info(`Exercice ${exercise.number} déjà corrigé, ignoré`);
				processed++;
				progress.report({
					increment: (1 / total) * 100,
					message: processed === total ? 'Terminé' : `Correction de l'exercice ${exercises[i + 1]?.number || 'suivant'}...`
				});
				continue;
			}

			try {
				await generateAndInsertCorrection(exercise, content, progress, token, false);
				completed++;
			} catch (error) {
				logger.error(`Erreur lors de la correction de l'exercice ${exercise.number}`, error as Error);
				handleCorrectionError(error);
				// Continue avec les autres exercices même en cas d'erreur
			}

			processed++;
			progress.report({
				increment: (1 / total) * 100,
				message: processed === total ? 'Terminé' : `Correction de l'exercice ${exercises[i + 1]?.number || 'suivant'}...`
			});
		}

		if (completed > 0 || processed > 0) {
			const failed = processed - completed;
			vscode.window.showInformationMessage(`${completed}/${processed} corrections générées avec ${failed} échecs`);
			logger.info(`${completed}/${processed} corrections générées avec ${failed} échecs`);
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

	// Commande de correction globale
	const corrigerDisposable = vscode.commands.registerCommand(
		'vscode-corriger-extension.corriger',
		handleCorrigerCommand
	);
	context.subscriptions.push(corrigerDisposable);
}

/**
 * Enregistre le participant de chat "corriger"
 * @param context Contexte d'extension VSCode
 */
function registerChatParticipant(context: vscode.ExtensionContext): void {
	// Vérifier si l'API de chat est disponible
	if (typeof vscode.chat?.createChatParticipant === 'function') {
		const chatParticipant = vscode.chat.createChatParticipant('corriger', handleChatParticipantRequest);
		chatParticipant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'resources', 'icon.png'); // Optionnel
		context.subscriptions.push(chatParticipant);
		logger.info('Participant de chat "corriger" enregistré');
	} else {
		logger.warn('API de chat non disponible - participant de chat non enregistré');
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Stocker le contexte globalement pour accéder aux ressources
	extensionContext = context;

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	logger.info('Félicitations, votre extension "vscode-corriger-extension" est maintenant active !');

	// Enregistrer les commandes
	registerCommands(context);

	// Enregistrer le participant de chat
	registerChatParticipant(context);
}

// This method is called when your extension is deactivated
export function deactivate() { }
