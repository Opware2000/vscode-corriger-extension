import * as vscode from 'vscode';
import { TIMEOUTS, LIMITS, MESSAGES } from './constants';

// Rate limiting state
let requestTimestamps: number[] = [];

/**
 * Get configuration value with fallback to default
 */
function getConfig<T>(key: string, defaultValue: T): T {
    const config = vscode.workspace.getConfiguration('vscode-corriger-extension');
    return config.get(key, defaultValue);
}

export async function isCopilotAvailable(): Promise<boolean> {
    try {
        const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
        return models.length > 0;
    } catch {
        return false;
    }
}

/**
 * Check if rate limit is exceeded
 */
function isRateLimitExceeded(): boolean {
    const now = Date.now();
    const rateLimitRequests = getConfig('rateLimitRequests', LIMITS.MAX_REQUESTS_PER_WINDOW);
    // Remove timestamps older than the window
    requestTimestamps = requestTimestamps.filter(timestamp =>
        now - timestamp < TIMEOUTS.RATE_LIMIT_WINDOW
    );
    return requestTimestamps.length >= rateLimitRequests;
}

/**
 * Record a request for rate limiting
 */
function recordRequest(): void {
    requestTimestamps.push(Date.now());
}

export async function callCopilotWithTimeout(
    messages: vscode.LanguageModelChatMessage[],
    timeoutMs?: number,
    cancellationToken?: vscode.CancellationToken
): Promise<vscode.LanguageModelChatResponse> {
    // Use config value if not provided
    const actualTimeout = timeoutMs ?? getConfig('copilotTimeout', TIMEOUTS.COPILOT_REQUEST);

    // Check rate limit
    if (isRateLimitExceeded()) {
        throw new Error(MESSAGES.RATE_LIMIT_EXCEEDED);
    }

    const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
    if (models.length === 0) {
        throw new Error(MESSAGES.COPILOT_UNAVAILABLE);
    }

    const model = models[0];
    const tokenSource = new vscode.CancellationTokenSource();

    // Combine external cancellation token with our timeout
    const combinedToken = cancellationToken || tokenSource.token;

    // Set timeout
    const timeoutId = setTimeout(() => {
        tokenSource.cancel();
    }, actualTimeout);

    try {
        recordRequest();
        console.log(`Appel à Copilot avec timeout de ${actualTimeout}ms`);
        const request = await model.sendRequest(messages, {}, combinedToken);
        clearTimeout(timeoutId);
        console.log('Réponse reçue de Copilot');
        return request;
    } catch (error) {
        clearTimeout(timeoutId);
        if (tokenSource.token.isCancellationRequested && !cancellationToken?.isCancellationRequested) {
            throw new Error('Timeout calling Copilot');
        }
        if (cancellationToken?.isCancellationRequested) {
            throw new Error(MESSAGES.GENERATION_CANCELLED);
        }
        throw error;
    }
}