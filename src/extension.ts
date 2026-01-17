// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getActiveDocumentContent } from './document-access';
import { detectExercises } from './latex-parser';
import { selectExercise, clearExerciseHighlights } from './exercise-selector';
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
}

// This method is called when your extension is deactivated
export function deactivate() { }
