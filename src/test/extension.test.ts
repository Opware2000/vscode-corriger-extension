import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { getActiveDocumentContent } from '../document-access';
import { detectExercises, parseExerciseStructure, Exercise, ExerciseStructure } from '../latex-parser';
import { selectExercise, highlightExercise, clearExerciseHighlights } from '../exercise-selector';

// Test data factories
const createLatexWithExercises = (count: number, overrides: string[] = []): string => {
	const exercises = [];
	for (let i = 0; i < count; i++) {
		const content = overrides[i] || `Contenu de l'exercice ${i + 1}`;
		exercises.push(`\\begin{exercice}\n${content}\n\\end{exercice}`);
	}
	return exercises.join('\n\n');
};

const createExerciseWithStructure = (options: {
	enonce?: string;
	correction?: string;
	otherContent?: string;
}): string => {
	let content = '\\begin{exercice}\n';
	if (options.enonce) {
		content += `\\begin{enonce}\n${options.enonce}\n\\end{enonce}\n`;
	}
	if (options.correction) {
		content += `\\begin{correction}\n${options.correction}\n\\end{correction}\n`;
	}
	if (options.otherContent) {
		content += options.otherContent + '\n';
	}
	content += '\\end{exercice}';
	return content;
};

suite('Extension Test Suite', () => {
	suiteSetup(() => {
		vscode.window.showInformationMessage('Démarrage des tests de l\'extension.');
	});

	suite('getActiveDocumentContent', () => {
		let sandbox: sinon.SinonSandbox;

		suiteSetup(() => {
			sandbox = sinon.createSandbox();
		});

		suiteTeardown(() => {
			sandbox.restore();
		});

		test('[P2] should return document content when active editor exists', () => {
			// GIVEN: Mock active text editor with document content
			const mockDocument = {
				getText: sandbox.stub().returns('Mock document content')
			};
			const mockEditor = {
				document: mockDocument
			};
			sandbox.stub(vscode.window, 'activeTextEditor').value(mockEditor);

			// WHEN: Getting active document content
			const content = getActiveDocumentContent();

			// THEN: Returns the document content
			assert.strictEqual(content, 'Mock document content');
		});

		test('[P2] should return empty string when no active editor exists', () => {
			// GIVEN: No active text editor
			sandbox.stub(vscode.window, 'activeTextEditor').value(undefined);

			// WHEN: Getting active document content
			const content = getActiveDocumentContent();

			// THEN: Returns empty string
			assert.strictEqual(content, '');
		});
	});

	suite('detectExercises', () => {
		test('[P1] should detect single exercise in LaTeX content', () => {
			// GIVEN: LaTeX content with one exercise
			const latexContent = createLatexWithExercises(1);

			// WHEN: Detecting exercises
			const exercises = detectExercises(latexContent);

			// THEN: Returns array with one exercise
			assert.ok(Array.isArray(exercises));
			assert.strictEqual(exercises.length, 1);
			assert.strictEqual(exercises[0].number, 1);
			assert.strictEqual(typeof exercises[0].start, 'number');
			assert.strictEqual(typeof exercises[0].end, 'number');
			assert.ok(exercises[0].content.includes('\\begin{exercice}'));
			assert.ok(exercises[0].content.includes('\\end{exercice}'));
		});

		test('[P1] should detect multiple exercises in LaTeX content', () => {
			// GIVEN: LaTeX content with three exercises
			const latexContent = createLatexWithExercises(3);

			// WHEN: Detecting exercises
			const exercises = detectExercises(latexContent);

			// THEN: Returns array with three exercises
			assert.ok(Array.isArray(exercises));
			assert.strictEqual(exercises.length, 3);
			exercises.forEach((exercise: Exercise, index: number) => {
				assert.strictEqual(exercise.number, index + 1);
				assert.strictEqual(typeof exercise.start, 'number');
				assert.strictEqual(typeof exercise.end, 'number');
				assert.ok(exercise.content.includes(`Contenu de l'exercice ${index + 1}`));
			});
		});

		test('[P1] should return empty array when no exercises found', () => {
			// GIVEN: LaTeX content without exercises
			const latexContent = `
\\begin{document}
Voici du contenu LaTeX normal sans exercices.
\\end{document}
`;

			// WHEN: Detecting exercises
			const exercises = detectExercises(latexContent);

			// THEN: Returns empty array
			assert.ok(Array.isArray(exercises));
			assert.strictEqual(exercises.length, 0);
		});

		test('[P2] should handle exercises with complex content', () => {
			// GIVEN: Exercise with complex LaTeX content
			const complexContent = `
\\begin{exercice}
\\begin{enonce}
Résoudre l'équation $x^2 + 2x + 1 = 0$.
\\end{enonce}
\\begin{correction}
$(x+1)^2 = 0$ donc $x = -1$.
\\end{correction}
\\end{exercice}
`;

			// WHEN: Detecting exercises
			const exercises = detectExercises(complexContent);

			// THEN: Correctly detects the exercise
			assert.strictEqual(exercises.length, 1);
			assert.ok(exercises[0].content.includes('x^2 + 2x + 1 = 0'));
		});

		test('[P2] should handle exercises at document boundaries', () => {
			// GIVEN: Exercise at the start and end of document
			const boundaryContent = `\\begin{exercice}
Premier exercice
\\end{exercice}

Du texte intermédiaire

\\begin{exercice}
Dernier exercice
\\end{exercice}`;

			// WHEN: Detecting exercises
			const exercises = detectExercises(boundaryContent);

			// THEN: Detects both exercises correctly
			assert.strictEqual(exercises.length, 2);
			assert.ok(exercises[0].content.includes('Premier exercice'));
			assert.ok(exercises[1].content.includes('Dernier exercice'));
		});

		test('[P3] should handle malformed exercises gracefully', () => {
			// GIVEN: Content with malformed exercise tags
			const malformedContent = `
\\begin{exercice}
Exercice valide
\\end{exercice}

\\begin{exercice}
Exercice sans fin

Du texte après
`;

			// WHEN: Detecting exercises
			const exercises = detectExercises(malformedContent);

			// THEN: Only detects the valid exercise
			assert.strictEqual(exercises.length, 1);
			assert.ok(exercises[0].content.includes('Exercice valide'));
		});

		test('[P3] should handle large documents with many exercises', () => {
			// GIVEN: Large document with 100 exercises
			const largeContent = createLatexWithExercises(100);

			// WHEN: Detecting exercises
			const exercises = detectExercises(largeContent);

			// THEN: Detects all exercises correctly
			assert.strictEqual(exercises.length, 100);
			exercises.forEach((exercise: Exercise, index: number) => {
				assert.strictEqual(exercise.number, index + 1);
				assert.ok(exercise.content.includes(`Contenu de l'exercice ${index + 1}`));
			});
		});

		test('[P3] should handle very large documents efficiently', () => {
			// GIVEN: Very large document with 1000 exercises
			const veryLargeContent = createLatexWithExercises(1000);

			// WHEN: Detecting exercises
			const startTime = Date.now();
			const exercises = detectExercises(veryLargeContent);
			const endTime = Date.now();

			// THEN: Detects all exercises and completes within reasonable time (< 1 second)
			assert.strictEqual(exercises.length, 1000);
			assert.ok(endTime - startTime < 1000, `Detection took ${endTime - startTime}ms, should be < 1000ms`);
		});

		test('[P3] should handle deeply nested malformed structures', () => {
			// GIVEN: Content with deeply nested malformed tags
			const nestedMalformedContent = `
\\begin{exercice}
\\begin{enonce}
\\begin{exercice}
Exercice imbriqué
\\end{exercice}
\\end{enonce}
\\end{exercice}
`;

			// WHEN: Detecting exercises
			const exercises = detectExercises(nestedMalformedContent);

			// THEN: Detects the outer exercise
			assert.strictEqual(exercises.length, 1);
			assert.ok(exercises[0].content.includes('Exercice imbriqué'));
		});

		test('[P3] should handle exercises with special regex characters', () => {
			// GIVEN: Content with regex special characters in exercises
			const specialCharsContent = '\\begin{exercice}\nContenu avec .*+?^${}()|[]\\\\\n\\end{exercice}';

			// WHEN: Detecting exercises
			const exercises = detectExercises(specialCharsContent);

			// THEN: Detects the exercise correctly
			assert.strictEqual(exercises.length, 1);
			assert.ok(exercises[0].content.includes('.*+?^${}()|[]\\\\'));
		});

		test('[P2] should generate titles from enonce content', () => {
			// GIVEN: Exercise with enonce
			const content = `\\begin{exercice}
\\begin{enonce}
Résoudre l'équation
\\end{enonce}
\\end{exercice}`;

			// WHEN: Detecting exercises
			const exercises = detectExercises(content);

			// THEN: Title is extracted from enonce
			assert.strictEqual(exercises.length, 1);
			assert.strictEqual(exercises[0].title, 'Résoudre l\'équation');
		});

		test('[P2] should generate default title when no enonce', () => {
			// GIVEN: Exercise without enonce
			const content = `\\begin{exercice}
Contenu sans enonce
\\end{exercice}`;

			// WHEN: Detecting exercises
			const exercises = detectExercises(content);

			// THEN: Default title is used
			assert.strictEqual(exercises.length, 1);
			assert.strictEqual(exercises[0].title, 'Exercice 1');
		});

		test('[P2] should truncate long enonce titles', () => {
			// GIVEN: Exercise with long enonce
			const longEnonce = 'A'.repeat(60);
			const content = `\\begin{exercice}
\\begin{enonce}
${longEnonce}
\\end{enonce}
\\end{exercice}`;

			// WHEN: Detecting exercises
			const exercises = detectExercises(content);

			// THEN: Title is truncated
			assert.strictEqual(exercises.length, 1);
			assert.ok(exercises[0].title!.endsWith('...'));
			assert.strictEqual(exercises[0].title!.length, 53); // 50 + '...'
		});
	});

	suite('parseExerciseStructure', () => {
		test('[P1] should extract enonce from exercise content', () => {
			// GIVEN: Exercise with enonce only
			const exerciseContent = createExerciseWithStructure({
				enonce: 'Voici l\'énoncé de l\'exercice.'
			});

			// WHEN: Parsing exercise structure
			const structure = parseExerciseStructure(exerciseContent);

			// THEN: Extracts enonce correctly
			assert.ok(structure);
			assert.strictEqual(structure.enonce, 'Voici l\'énoncé de l\'exercice.');
			assert.strictEqual(structure.correction, undefined);
			assert.strictEqual(structure.otherContent, undefined);
		});

		test('[P1] should extract correction from exercise content', () => {
			// GIVEN: Exercise with correction only
			const exerciseContent = createExerciseWithStructure({
				correction: 'Voici la correction de l\'exercice.'
			});

			// WHEN: Parsing exercise structure
			const structure = parseExerciseStructure(exerciseContent);

			// THEN: Extracts correction correctly
			assert.ok(structure);
			assert.strictEqual(structure.correction, 'Voici la correction de l\'exercice.');
			assert.strictEqual(structure.enonce, undefined);
		});

		test('[P1] should extract both enonce and correction', () => {
			// GIVEN: Exercise with both enonce and correction
			const exerciseContent = createExerciseWithStructure({
				enonce: 'Résoudre x + 1 = 0',
				correction: 'x = -1'
			});

			// WHEN: Parsing exercise structure
			const structure = parseExerciseStructure(exerciseContent);

			// THEN: Extracts both correctly
			assert.ok(structure);
			assert.strictEqual(structure.enonce, 'Résoudre x + 1 = 0');
			assert.strictEqual(structure.correction, 'x = -1');
		});

		test('[P2] should extract other content when present', () => {
			// GIVEN: Exercise with enonce, correction, and other content
			const exerciseContent = createExerciseWithStructure({
				enonce: 'Énoncé principal',
				correction: 'Correction principale',
				otherContent: 'Contenu supplémentaire et notes'
			});

			// WHEN: Parsing exercise structure
			const structure = parseExerciseStructure(exerciseContent);

			// THEN: Extracts all parts correctly
			assert.ok(structure);
			assert.strictEqual(structure.enonce, 'Énoncé principal');
			assert.strictEqual(structure.correction, 'Correction principale');
			assert.strictEqual(structure.otherContent, 'Contenu supplémentaire et notes');
		});

		test('[P2] should handle exercise with only other content', () => {
			// GIVEN: Exercise with only other content
			const exerciseContent = createExerciseWithStructure({
				otherContent: 'Contenu sans structure particulière'
			});

			// WHEN: Parsing exercise structure
			const structure = parseExerciseStructure(exerciseContent);

			// THEN: Extracts other content correctly
			assert.ok(structure);
			assert.strictEqual(structure.otherContent, 'Contenu sans structure particulière');
		});

		test('[P2] should trim whitespace from extracted content', () => {
			// GIVEN: Exercise with extra whitespace
			const exerciseContent = `\\begin{exercice}
\\begin{enonce}

  Énoncé avec espaces

\\end{enonce}
\\begin{correction}
  Correction avec espaces
\\end{correction}
\\end{exercice}`;

			// WHEN: Parsing exercise structure
			const structure = parseExerciseStructure(exerciseContent);

			// THEN: Trims whitespace correctly
			assert.strictEqual(structure.enonce, 'Énoncé avec espaces');
			assert.strictEqual(structure.correction, 'Correction avec espaces');
		});

		test('[P3] should handle empty exercise gracefully', () => {
			// GIVEN: Empty exercise
			const exerciseContent = '\\begin{exercice}\\end{exercice}';

			// WHEN: Parsing exercise structure
			const structure = parseExerciseStructure(exerciseContent);

			// THEN: Returns empty structure
			assert.ok(structure);
			assert.strictEqual(structure.enonce, undefined);
			assert.strictEqual(structure.correction, undefined);
			assert.strictEqual(structure.otherContent, undefined);
		});

		test('[P3] should handle malformed structure gracefully', () => {
			// GIVEN: Exercise with malformed tags
			const exerciseContent = `\\begin{exercice}
\\begin{enonce}
Énoncé valide
\\end{enonce}
\\begin{correction}
Correction sans fin
Contenu restant
\\end{exercice}`;

			// WHEN: Parsing exercise structure
			const structure = parseExerciseStructure(exerciseContent);

			// THEN: Extracts what it can
			assert.ok(structure);
			assert.strictEqual(structure.enonce, 'Énoncé valide');
			assert.strictEqual(structure.otherContent, '\\begin{correction}\nCorrection sans fin\nContenu restant');
		});
	});

	suite('selectExercise', () => {
		let sandbox: sinon.SinonSandbox;

		suiteSetup(() => {
			sandbox = sinon.createSandbox();
		});

		suiteTeardown(() => {
			sandbox.restore();
		});

		test('[P1] should return selected exercise when user selects one', async () => {
			// GIVEN: Mock exercises and QuickPick selection
			const exercises: Exercise[] = [
				{ number: 1, start: 0, end: 10, content: 'ex1', title: 'Ex1' },
				{ number: 2, start: 11, end: 20, content: 'ex2', title: 'Ex2' }
			];
			const mockQuickPickItem = {
				label: 'Exercice 1',
				description: 'Ex1',
				detail: 'Lignes 0-10',
				exercise: exercises[0]
			};
			sandbox.stub(vscode.window, 'showQuickPick').resolves(mockQuickPickItem);

			// WHEN: Selecting exercise
			const selected = await selectExercise(exercises);

			// THEN: Returns the first exercise
			assert.ok(selected);
			assert.strictEqual(selected.number, 1);
			assert.strictEqual(selected.content, 'ex1');
		});

		test('[P1] should show information message when no exercises provided', async () => {
			// GIVEN: No exercises
			const exercises: Exercise[] = [];
			const showInfoStub = sandbox.stub(vscode.window, 'showInformationMessage');

			// WHEN: Selecting exercise
			const selected = await selectExercise(exercises);

			// THEN: Shows message and returns undefined
			assert.ok(showInfoStub.calledOnce);
			assert.strictEqual(selected, undefined);
		});
	});

	suite('highlightExercise', () => {
		let sandbox: sinon.SinonSandbox;

		suiteSetup(() => {
			sandbox = sinon.createSandbox();
		});

		suiteTeardown(() => {
			sandbox.restore();
		});

		test('[P2] should highlight exercise when active editor exists', () => {
			// GIVEN: Mock active editor and exercise
			const mockDocument = {
				positionAt: sandbox.stub().callsFake((offset: number) => ({ line: offset, character: 0 }))
			};
			const mockEditor = {
				document: mockDocument,
				setDecorations: sandbox.stub()
			};
			sandbox.stub(vscode.window, 'activeTextEditor').value(mockEditor);
			const exercise: Exercise = { number: 1, start: 10, end: 20, content: 'test', title: 'Test' };

			// WHEN: Highlighting exercise
			highlightExercise(exercise);

			// THEN: Sets decorations on editor
			assert.ok(mockEditor.setDecorations.calledOnce);
		});

		test('[P2] should do nothing when no active editor exists', () => {
			// GIVEN: No active editor
			sandbox.stub(vscode.window, 'activeTextEditor').value(undefined);
			const exercise: Exercise = { number: 1, start: 10, end: 20, content: 'test', title: 'Test' };

			// WHEN: Highlighting exercise
			highlightExercise(exercise);

			// THEN: No decorations set
		});
	});

	suite('clearExerciseHighlights', () => {
		let sandbox: sinon.SinonSandbox;

		suiteSetup(() => {
			sandbox = sinon.createSandbox();
		});

		suiteTeardown(() => {
			sandbox.restore();
		});

		test('[P2] should clear highlights when active editor exists', () => {
			// GIVEN: Mock active editor
			const mockEditor = {
				setDecorations: sandbox.stub()
			};
			sandbox.stub(vscode.window, 'activeTextEditor').value(mockEditor);

			// WHEN: Clearing highlights
			clearExerciseHighlights();

			// THEN: Sets decorations with empty array
			assert.ok(mockEditor.setDecorations.calledOnce);
		});

		test('[P2] should do nothing when no active editor exists', () => {
			// GIVEN: No active editor
			sandbox.stub(vscode.window, 'activeTextEditor').value(undefined);

			// WHEN: Clearing highlights
			clearExerciseHighlights();

			// THEN: No decorations set
		});
	});

	suite('Integration Tests', () => {
		test('[P1] should detect and parse multiple exercises correctly', () => {
			// GIVEN: LaTeX content with multiple structured exercises
			const latexContent = `
\\begin{exercice}
\\begin{enonce}
Premier énoncé
\\end{enonce}
\\begin{correction}
Première correction
\\end{correction}
\\end{exercice}

\\begin{exercice}
\\begin{enonce}
Deuxième énoncé
\\end{enonce}
\\end{exercice}
`;

			// WHEN: Detecting and parsing exercises
			const exercises = detectExercises(latexContent);
			const structures = exercises.map(ex => parseExerciseStructure(ex.content));

			// THEN: Correctly processes all exercises
			assert.strictEqual(exercises.length, 2);
			assert.strictEqual(structures[0].enonce, 'Premier énoncé');
			assert.strictEqual(structures[0].correction, 'Première correction');
			assert.strictEqual(structures[1].enonce, 'Deuxième énoncé');
			assert.strictEqual(structures[1].correction, undefined);
		});
	});
});
