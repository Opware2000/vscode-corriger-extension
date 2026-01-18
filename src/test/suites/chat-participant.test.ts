import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';

suite('Chat Participant - corriger', () => {
    let sandbox: sinon.SinonSandbox;

    suiteSetup(() => {
        sandbox = sinon.createSandbox();
    });

    suiteTeardown(() => {
        sandbox.restore();
    });

    test('[P1] should register corriger chat participant', async () => {
        // GIVEN: Extension is activated
        // WHEN: Checking if chat participant is registered
        const commands = await vscode.commands.getCommands(true);
        const hasCorrigerParticipant = commands.includes('vscode-corriger-extension.corriger-chat-participant');

        // THEN: Chat participant should be registered
        assert.ok(hasCorrigerParticipant, 'Le participant de chat corriger devrait être enregistré');
    });

    test('[P1] should handle chat participant request', async () => {
        // GIVEN: Mock chat request
        const mockRequest = {
            prompt: 'Corriger cet exercice',
            command: 'corriger',
            references: []
        };
        const mockContext = {
            history: []
        };

        // WHEN: Executing chat participant command
        try {
            const result = await vscode.commands.executeCommand('vscode-corriger-extension.corriger-chat-participant', mockRequest, mockContext);
            // THEN: Command executes without throwing
            assert.ok(true, 'Le participant de chat devrait traiter la requête sans erreur');
        } catch (error) {
            assert.fail(`Le participant de chat a échoué: ${error}`);
        }
    });
});