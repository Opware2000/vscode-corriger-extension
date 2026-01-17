// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getActiveDocumentContent } from './document-access';
import { detectExercises, parseExerciseStructure } from './latex-parser';
import { selectExercise, clearExerciseHighlights } from './exercise-selector';
import { generateCorrection } from './correction-generator';
import { MESSAGES } from './constants';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-corriger-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vscode-corriger-extension.detectExercises', async () => {
		// Effacer les anciennes mises en surbrillance
		clearExerciseHighlights();

		// Récupérer le contenu du document actif
		const content = getActiveDocumentContent();

		if (!content) {
			vscode.window.showInformationMessage(MESSAGES.NO_DOCUMENT);
			return;
		}

		// Détecter les exercices dans le contenu
		const exercises = detectExercises(content);

		if (exercises.length === 0) {
			vscode.window.showInformationMessage(MESSAGES.NO_EXERCISES_FOUND);
			return;
		}

		// Afficher le nombre d'exercices détectés
		const message = MESSAGES.EXERCISES_DETECTED(exercises.length);
		vscode.window.showInformationMessage(message);

		// Afficher les détails dans la console
		console.log('Exercices détectés:', exercises);

		// Permettre la sélection d'un exercice
		selectExercise(exercises).then(selectedExercise => {
			if (selectedExercise) {
				vscode.window.showInformationMessage(MESSAGES.EXERCISE_SELECTED(selectedExercise.number));
				console.log('Exercice sélectionné:', selectedExercise);
			}
		}).catch(error => {
			console.error('Erreur lors de la sélection d\'exercice:', error);
			vscode.window.showErrorMessage('Erreur lors de la sélection d\'exercice');
		});
	});

	context.subscriptions.push(disposable);

	// Commande pour générer une correction
	const generateCorrectionDisposable = vscode.commands.registerCommand('vscode-corriger-extension.generateCorrection', async () => {
		// Récupérer le contenu du document actif
		const content = getActiveDocumentContent();

		if (!content) {
			vscode.window.showInformationMessage(MESSAGES.NO_DOCUMENT);
			return;
		}

		// Détecter les exercices
		const exercises = detectExercises(content);

		if (exercises.length === 0) {
			vscode.window.showInformationMessage(MESSAGES.NO_EXERCISES_FOUND);
			return;
		}

		// Sélectionner un exercice
		const selectedExercise = await selectExercise(exercises);

		if (!selectedExercise) {
			return;
		}

		// Vérifier si l'exercice a déjà une correction
		const structure = parseExerciseStructure(selectedExercise.content);
		if (structure.correction) {
			vscode.window.showInformationMessage('Cet exercice a déjà une correction.');
			return;
		}

		// Générer la correction avec progression et annulation
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: 'Génération de la correction',
			cancellable: true
		}, async (progress, token) => {
			try {
				progress.report({ increment: 0, message: 'Préparation...' });

				const correction = await generateCorrection(selectedExercise.content, token);

				progress.report({ increment: 100, message: 'Insertion de la correction...' });

				// Insérer la correction dans le document
				const editor = vscode.window.activeTextEditor;
				if (editor) {
					const position = editor.document.positionAt(selectedExercise.end);
					await editor.edit(editBuilder => {
						editBuilder.insert(position, '\n' + correction);
					});
					vscode.window.showInformationMessage('Correction générée et insérée avec succès.');
				}
			} catch (error) {
				const errorMessage = (error as Error).message;
				console.error('Erreur lors de la génération de correction:', errorMessage);

				// Afficher des messages d'erreur spécifiques
				if (errorMessage.includes('Copilot not available')) {
					vscode.window.showErrorMessage(MESSAGES.COPILOT_UNAVAILABLE);
				} else if (errorMessage.includes('rate limit')) {
					vscode.window.showErrorMessage(MESSAGES.RATE_LIMIT_EXCEEDED);
				} else if (errorMessage.includes('cancelled')) {
					vscode.window.showInformationMessage(MESSAGES.GENERATION_CANCELLED);
				} else {
					vscode.window.showErrorMessage(`Erreur lors de la génération de correction: ${errorMessage}`);
				}
			}
		});
	});

	context.subscriptions.push(generateCorrectionDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
