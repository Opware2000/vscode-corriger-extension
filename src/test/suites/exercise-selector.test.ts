import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { selectExercise, highlightExercise, clearExerciseHighlights } from '../../exercise-selector';
import { Exercise, ExerciseStatus } from '../../latex-parser';

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
            { number: 1, start: 0, end: 10, content: 'ex1', title: 'Ex1', status: ExerciseStatus.PENDING },
            { number: 2, start: 11, end: 20, content: 'ex2', title: 'Ex2', status: ExerciseStatus.PENDING }
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
        const exercise: Exercise = { number: 1, start: 10, end: 20, content: 'test', title: 'Test', status: ExerciseStatus.PENDING };

        // WHEN: Highlighting exercise
        highlightExercise(exercise);

        // THEN: Sets decorations on editor
        assert.ok(mockEditor.setDecorations.calledOnce);
    });

    test('[P2] should do nothing when no active editor exists', () => {
        // GIVEN: No active editor
        sandbox.stub(vscode.window, 'activeTextEditor').value(undefined);
        const exercise: Exercise = { number: 1, start: 10, end: 20, content: 'test', title: 'Test', status: ExerciseStatus.PENDING };

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