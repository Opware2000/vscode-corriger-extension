import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';

suite('corriger command', () => {
    let sandbox: sinon.SinonSandbox;

    suiteSetup(() => {
        sandbox = sinon.createSandbox();
    });

    suiteTeardown(() => {
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
});