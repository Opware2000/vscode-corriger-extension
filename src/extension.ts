// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getActiveDocumentContent } from './document-access';
import { detectExercises } from './latex-parser';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-corriger-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vscode-corriger-extension.detectExercises', () => {
		// Récupérer le contenu du document actif
		const content = getActiveDocumentContent();

		if (!content) {
			vscode.window.showInformationMessage('Aucun document ouvert ou document vide.');
			return;
		}

		// Détecter les exercices dans le contenu
		const exercises = detectExercises(content);

		if (exercises.length === 0) {
			vscode.window.showInformationMessage('Aucun exercice détecté dans le document.');
			return;
		}

		// Afficher le nombre d'exercices détectés
		const message = `${exercises.length} exercice(s) détecté(s) dans le document.`;
		vscode.window.showInformationMessage(message);

		// Afficher les détails dans la console
		console.log('Exercices détectés:', exercises);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
