import * as vscode from 'vscode';
import { TIMEOUTS, LIMITS, MESSAGES } from './constants';
import { logger } from './logger';
import { getConfig } from './config';

// Rate limiting state
let requestTimestamps: number[] = [];


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
    const actualTimeout = timeoutMs ?? getConfig('copilotTimeout', TIMEOUTS.COPILOT_REQUEST);
    const tokenSource = new vscode.CancellationTokenSource();
    const combinedToken = cancellationToken || tokenSource.token;

    const timeoutId = setTimeout(() => {
        tokenSource.cancel();
    }, actualTimeout);

    try {
        // Check rate limit
        if (isRateLimitExceeded()) {
            throw new Error(MESSAGES.RATE_LIMIT_EXCEEDED);
        }

        const copilotFamily = getConfig('copilotModel', 'gpt-4');
        const models = await vscode.lm.selectChatModels({ vendor: 'copilot', family: copilotFamily });
        if (models.length === 0) {
            // Fallback to any copilot model if specific family not available
            const fallbackModels = await vscode.lm.selectChatModels({ vendor: 'copilot' });
            if (fallbackModels.length === 0) {
                throw new Error(MESSAGES.COPILOT_UNAVAILABLE);
            }
            models.push(...fallbackModels);
        }

        const model = models[0];
        recordRequest();
        logger.info(`Appel à Copilot avec timeout de ${actualTimeout}ms`);
        const request = await model.sendRequest(messages, {}, combinedToken);
        logger.info('Réponse reçue de Copilot');
        return request;
    } catch (error) {
        if (cancellationToken?.isCancellationRequested) {
            throw new Error(MESSAGES.GENERATION_CANCELLED);
        }
        if (tokenSource.token.isCancellationRequested) {
            throw new Error('Timeout calling Copilot');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId); // Toujours nettoyer le timer
    }
}