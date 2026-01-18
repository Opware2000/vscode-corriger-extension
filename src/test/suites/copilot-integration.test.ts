import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { isCopilotAvailable, callCopilotWithTimeout } from '../../copilot-integration';

suite('Copilot Integration', () => {
    let sandbox: sinon.SinonSandbox;

    suiteSetup(() => {
        sandbox = sinon.createSandbox();
    });

    suiteTeardown(() => {
        sandbox.restore();
    });

    test('[P1] should return true when Copilot Chat API is available', async () => {
        // GIVEN: Copilot API is available
        const mockModel = {
            sendRequest: sandbox.stub(),
            name: 'test',
            id: 'test',
            vendor: 'copilot',
            family: 'gpt-4',
            version: '1',
            maxInputTokens: 1000,
            maxOutputTokens: 1000
        };
        sandbox.stub(vscode.lm, 'selectChatModels').resolves([mockModel as any]);

        // WHEN: Checking Copilot availability
        const available = await isCopilotAvailable();

        // THEN: Returns true
        assert.strictEqual(available, true);
    });

    test('[P1] should return false when Copilot Chat API is not available', async () => {
        // GIVEN: Copilot API is not available
        sandbox.stub(vscode.lm, 'selectChatModels').resolves([]);

        // WHEN: Checking Copilot availability
        const available = await isCopilotAvailable();

        // THEN: Returns false
        assert.strictEqual(available, false);
    });

    test('[P1] should call Copilot with messages and return response within timeout', async () => {
        // GIVEN: Mock Copilot response
        const mockResponse = { text: 'Mock correction response' };
        const mockModel = {
            sendRequest: sandbox.stub().resolves(mockResponse),
            name: 'test',
            id: 'test',
            vendor: 'copilot',
            family: 'gpt-4',
            version: '1',
            maxInputTokens: 1000,
            maxOutputTokens: 1000
        };
        sandbox.stub(vscode.lm, 'selectChatModels').resolves([mockModel as any]);

        // WHEN: Calling Copilot with timeout
        const messages = [vscode.LanguageModelChatMessage.User('Test message')];
        const response = await callCopilotWithTimeout(messages, 30000);

        // THEN: Returns the response
        assert.strictEqual(response, mockResponse);
        assert.ok(mockModel.sendRequest.calledOnce);
    });

    test('[P2] should timeout and throw error when Copilot takes too long', async () => {
        // GIVEN: Mock slow Copilot response
        const mockModel = {
            sendRequest: sandbox.stub().callsFake(() => new Promise(resolve => setTimeout(() => resolve({ text: 'response' }), 40000))),
            name: 'test',
            id: 'test',
            vendor: 'copilot',
            family: 'gpt-4',
            version: '1',
            maxInputTokens: 1000,
            maxOutputTokens: 1000
        };
        sandbox.stub(vscode.lm, 'selectChatModels').resolves([mockModel as any]);

        // WHEN & THEN: Calling Copilot with short timeout should throw
        const messages = [vscode.LanguageModelChatMessage.User('Test message')];
        await assert.rejects(async () => {
            await callCopilotWithTimeout(messages, 1000);
        }, /timeout/i);
    });
});