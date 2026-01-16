import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';
import { getActiveDocumentContent } from '../document-access';
import { detectExercises, parseExerciseStructure } from '../latex-parser';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('getActiveDocumentContent should return document content when active editor exists', () => {
		// This test will fail until we implement the function
		const content = getActiveDocumentContent();
		assert.strictEqual(typeof content, 'string');
	});

	test('detectExercises should return array of exercises from LaTeX content', () => {
		// This test will fail until we implement the function
		const latexContent = `
\\begin{exercice}
Voici un exercice.
\\end{exercice}

\\begin{exercice}
Un autre exercice.
\\end{exercice}
`;
		const exercises = detectExercises(latexContent);
		assert.ok(Array.isArray(exercises));
		assert.strictEqual(exercises.length, 2);
	});

	test('parseExerciseStructure should extract enonce and other elements from exercise content', () => {
		const exerciseContent = `\\begin{exercice}
\\begin{enonce}
Voici l'énoncé de l'exercice.
\\end{enonce}
Quelques détails supplémentaires.
\\end{exercice}`;
		const structure = parseExerciseStructure(exerciseContent);
		assert.ok(structure);
		assert.strictEqual(structure.enonce, 'Voici l\'énoncé de l\'exercice.');
	});
});
