import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { getActiveDocumentContent } from '../../document-access';

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