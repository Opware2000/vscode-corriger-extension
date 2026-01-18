// Fichier principal des tests - les tests sont maintenant organisés dans des fichiers séparés
// dans le dossier suites/ pour une meilleure maintenabilité

import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	suiteSetup(() => {
		vscode.window.showInformationMessage('Démarrage des tests de l\'extension.');
	});

	// Les tests spécifiques sont maintenant dans les fichiers suites/*.test.ts
	// Ce fichier sert de point d'entrée principal pour les tests
});