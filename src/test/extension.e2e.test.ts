import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

// Test data factories for E2E tests
const createLatexDocumentWithExercises = (count: number, overrides: string[] = []): string => {
    const exercises = [];
    for (let i = 0; i < count; i++) {
        const content = overrides[i] || `Contenu de l'exercice ${i + 1}`;
        exercises.push(`\\begin{exercice}\n${content}\n\\end{exercice}`);
    }
    return exercises.join('\n\n');
};

suite('Extension E2E Tests', () => {
    suiteSetup(async () => {
        // Wait for extension to be activated
        await vscode.extensions.getExtension('vscode-corriger-extension')?.activate();
    });

    suite('Command Execution', () => {
        test('[P0] should execute helloWorld command with valid LaTeX document', async () => {
            // GIVEN: Create a new document with LaTeX exercises
            const document = await vscode.workspace.openTextDocument({
                content: createLatexDocumentWithExercises(2),
                language: 'latex'
            });
            await vscode.window.showTextDocument(document);

            // Mock the information message to capture it
            let messageShown = '';
            const originalShowInformationMessage = vscode.window.showInformationMessage;
            vscode.window.showInformationMessage = (message: string) => {
                messageShown = message;
                return Promise.resolve(undefined as any);
            };

            // WHEN: Execute the helloWorld command
            await vscode.commands.executeCommand('vscode-corriger-extension.helloWorld');

            // THEN: Information message shows correct exercise count
            assert.strictEqual(messageShown, '2 exercice(s) détecté(s) dans le document.');

            // Restore original function
            vscode.window.showInformationMessage = originalShowInformationMessage;
        });

        test('[P0] should execute helloWorld command with no exercises', async () => {
            // GIVEN: Create a document with no exercises
            const document = await vscode.workspace.openTextDocument({
                content: '\\begin{document}\nContenu sans exercices\n\\end{document}',
                language: 'latex'
            });
            await vscode.window.showTextDocument(document);

            // Mock the information message
            let messageShown = '';
            const originalShowInformationMessage = vscode.window.showInformationMessage;
            vscode.window.showInformationMessage = (message: string) => {
                messageShown = message;
                return Promise.resolve(undefined as any);
            };

            // WHEN: Execute the command
            await vscode.commands.executeCommand('vscode-corriger-extension.helloWorld');

            // THEN: Shows no exercises message
            assert.strictEqual(messageShown, 'Aucun exercice détecté dans le document.');

            // Restore original function
            vscode.window.showInformationMessage = originalShowInformationMessage;
        });

        test('[P1] should handle empty document gracefully', async () => {
            // GIVEN: Create an empty document
            const document = await vscode.workspace.openTextDocument({
                content: '',
                language: 'latex'
            });
            await vscode.window.showTextDocument(document);

            // Mock the information message
            let messageShown = '';
            const originalShowInformationMessage = vscode.window.showInformationMessage;
            vscode.window.showInformationMessage = (message: string) => {
                messageShown = message;
                return Promise.resolve(undefined as any);
            };

            // WHEN: Execute the command
            await vscode.commands.executeCommand('vscode-corriger-extension.helloWorld');

            // THEN: Shows no document message
            assert.strictEqual(messageShown, 'Aucun document ouvert ou document vide.');

            // Restore original function
            vscode.window.showInformationMessage = originalShowInformationMessage;
        });

        test('[P1] should handle complex LaTeX structure with nested exercises', async () => {
            // GIVEN: Document with complex nested structure
            const complexContent = `
\\begin{document}
\\begin{exercice}
\\begin{enonce}
Résoudre l'équation $x^2 + 2x + 1 = 0$.
\\end{enonce}
\\begin{correction}
$(x+1)^2 = 0$ donc $x = -1$.
\\end{correction}
\\end{exercice}

Du texte intermédiaire

\\begin{exercice}
\\begin{enonce}
Calculer $2 + 2$.
\\end{enonce}
\\end{exercice}
\\end{document}
`;
            const document = await vscode.workspace.openTextDocument({
                content: complexContent,
                language: 'latex'
            });
            await vscode.window.showTextDocument(document);

            // Mock the information message
            let messageShown = '';
            const originalShowInformationMessage = vscode.window.showInformationMessage;
            vscode.window.showInformationMessage = (message: string) => {
                messageShown = message;
                return Promise.resolve(undefined as any);
            };

            // WHEN: Execute the command
            await vscode.commands.executeCommand('vscode-corriger-extension.helloWorld');

            // THEN: Detects both exercises
            assert.strictEqual(messageShown, '2 exercice(s) détecté(s) dans le document.');

            // Restore original function
            vscode.window.showInformationMessage = originalShowInformationMessage;
        });

        test('[P2] should handle large documents with many exercises', async () => {
            // GIVEN: Large document with 50 exercises
            const largeContent = createLatexDocumentWithExercises(50);
            const document = await vscode.workspace.openTextDocument({
                content: largeContent,
                language: 'latex'
            });
            await vscode.window.showTextDocument(document);

            // Mock the information message
            let messageShown = '';
            const originalShowInformationMessage = vscode.window.showInformationMessage;
            vscode.window.showInformationMessage = (message: string) => {
                messageShown = message;
                return Promise.resolve(undefined as any);
            };

            // WHEN: Execute the command
            await vscode.commands.executeCommand('vscode-corriger-extension.helloWorld');

            // THEN: Correctly counts all exercises
            assert.strictEqual(messageShown, '50 exercice(s) détecté(s) dans le document.');

            // Restore original function
            vscode.window.showInformationMessage = originalShowInformationMessage;
        });
    });

    suite('Extension Activation', () => {
        test('[P0] should activate on LaTeX language files', async () => {
            // GIVEN: LaTeX document is opened
            const document = await vscode.workspace.openTextDocument({
                content: '\\begin{document}\\end{document}',
                language: 'latex'
            });
            await vscode.window.showTextDocument(document);

            // WHEN: Extension is activated (already done in suiteSetup)

            // THEN: Extension should be active
            const extension = vscode.extensions.getExtension('vscode-corriger-extension');
            assert.ok(extension);
            assert.strictEqual(extension?.isActive, true);
        });

        test('[P1] should register commands correctly', async () => {
            // GIVEN: Extension is active

            // WHEN: Check registered commands
            const commands = await vscode.commands.getCommands(true);

            // THEN: helloWorld command should be registered
            assert.ok(commands.includes('vscode-corriger-extension.helloWorld'));
        });
    });
});