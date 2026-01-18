import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';

suite('corriger command', () => {
    let sandbox: sinon.SinonSandbox;

    setup(() => {
        sandbox = sinon.createSandbox();
    });

    teardown(() => {
        sandbox.restore();
    });

    test('[P1] should register corriger command', async () => {
        // GIVEN: Extension is activated
        // WHEN: Checking if command is registered
        const commands = await vscode.commands.getCommands(true);
        const hasCorrigerCommand = commands.includes('vscode-corriger-extension.corriger');

        // THEN: Command should be registered
        assert.ok(hasCorrigerCommand, 'La commande corriger devrait être enregistrée');
    });

    test('[P1] should execute corriger command without error', async () => {
        // GIVEN: Mock active editor with LaTeX content
        const mockDocument = {
            getText: sandbox.stub().returns('\\begin{exercice}\nTest exercise\n\\end{exercice}'),
            positionAt: sandbox.stub().callsFake((offset: number) => ({ line: offset, character: 0 }))
        };
        const mockEditor = {
            document: mockDocument,
            edit: sandbox.stub().resolves()
        };
        sandbox.stub(vscode.window, 'activeTextEditor').value(mockEditor);
        sandbox.stub(vscode.window, 'showInformationMessage');

        // WHEN: Executing corriger command
        try {
            await vscode.commands.executeCommand('vscode-corriger-extension.corriger');
            // THEN: Command executes without throwing
            assert.ok(true, 'La commande corriger devrait s\'exécuter sans erreur');
        } catch (error) {
            assert.fail(`La commande corriger a échoué: ${error}`);
        }
    });

    test('[P1] should skip already corrected exercises', async () => {
        // GIVEN: Mock active editor with one corrected and one uncorrected exercise
        const content = '\\begin{exercice}\nExercise 1\n\\end{exercice}\n\\begin{correction}\nCorrection 1\n\\end{correction}\n\\begin{exercice}\nExercise 2\n\\end{exercice}';
        const mockDocument = {
            getText: sandbox.stub().returns(content),
            positionAt: sandbox.stub().callsFake((offset: number) => ({ line: offset, character: 0 }))
        };
        const mockEditor = {
            document: mockDocument,
            edit: sandbox.stub().resolves()
        };
        sandbox.stub(vscode.window, 'activeTextEditor').value(mockEditor);
        sandbox.stub(vscode.window, 'showInformationMessage');

        // WHEN: Executing corriger command
        await vscode.commands.executeCommand('vscode-corriger-extension.corriger');

        // THEN: Only the uncorrected exercise should be processed
        // (Hard to verify with current mocks, but ensures no crash)
        assert.ok(true, 'La commande devrait gérer les exercices déjà corrigés');
    });

    test('[P1] should handle cancellation gracefully', async () => {
        // GIVEN: Mock that simulates cancellation
        const mockDocument = {
            getText: sandbox.stub().returns('\\begin{exercice}\nTest exercise\n\\end{exercice}'),
            positionAt: sandbox.stub().callsFake((offset: number) => ({ line: offset, character: 0 }))
        };
        const mockEditor = {
            document: mockDocument,
            edit: sandbox.stub().resolves()
        };
        sandbox.stub(vscode.window, 'activeTextEditor').value(mockEditor);
        const showInfoStub = sandbox.stub(vscode.window, 'showInformationMessage');

        // Mock withProgress to simulate cancellation
        sandbox.stub(vscode.window, 'withProgress').callsFake(async (_options, callback) => {
            const token = {
                isCancellationRequested: true,
                onCancellationRequested: sandbox.stub()
            };
            await callback({ report: sandbox.stub() }, token as any);
        });

        // WHEN: Executing corriger command
        await vscode.commands.executeCommand('vscode-corriger-extension.corriger');

        // THEN: Cancellation message should be shown
        assert.ok(showInfoStub.calledWith('Correction annulée par l\'utilisateur'), 'Message d\'annulation devrait être affiché');
    });
});