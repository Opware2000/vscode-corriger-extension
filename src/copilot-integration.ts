import * as vscode from 'vscode';

export async function isCopilotAvailable(): Promise<boolean> {
    try {
        const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
        return models.length > 0;
    } catch {
        return false;
    }
}

export async function callCopilotWithTimeout(messages: vscode.LanguageModelChatMessage[], timeoutMs: number): Promise<vscode.LanguageModelChatResponse> {
    const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
    if (models.length === 0) {
        throw new Error('Copilot not available');
    }

    const model = models[0];
    const tokenSource = new vscode.CancellationTokenSource();

    // Set timeout
    const timeoutId = setTimeout(() => {
        tokenSource.cancel();
    }, timeoutMs);

    try {
        const request = await model.sendRequest(messages, {}, tokenSource.token);
        clearTimeout(timeoutId);
        return request;
    } catch (error) {
        clearTimeout(timeoutId);
        if (tokenSource.token.isCancellationRequested) {
            throw new Error('Timeout calling Copilot');
        }
        throw error;
    }
}