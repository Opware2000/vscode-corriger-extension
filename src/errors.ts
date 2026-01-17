/**
 * Classes d'erreur personnalisées pour l'extension VSCode
 */

/**
 * Erreur de base de l'extension
 */
export class ExtensionError extends Error {
    public readonly code: string;
    public readonly isUserError: boolean;

    constructor(message: string, code: string, isUserError: boolean = false) {
        super(message);
        this.name = 'ExtensionError';
        this.code = code;
        this.isUserError = isUserError;
    }
}

/**
 * Erreur liée à Copilot
 */
export class CopilotError extends ExtensionError {
    constructor(message: string, code: string = 'COPILOT_ERROR') {
        super(message, code, true);
        this.name = 'CopilotError';
    }
}

/**
 * Erreur de rate limiting
 */
export class RateLimitError extends ExtensionError {
    public readonly retryAfter?: number;

    constructor(message: string, retryAfter?: number) {
        super(message, 'RATE_LIMIT_EXCEEDED', true);
        this.name = 'RateLimitError';
        this.retryAfter = retryAfter;
    }
}

/**
 * Erreur d'annulation
 */
export class CancellationError extends ExtensionError {
    constructor(message: string = 'Opération annulée par l\'utilisateur') {
        super(message, 'CANCELLED', true);
        this.name = 'CancellationError';
    }
}

/**
 * Erreur de parsing LaTeX
 */
export class LatexParseError extends ExtensionError {
    constructor(message: string) {
        super(message, 'LATEX_PARSE_ERROR', false);
        this.name = 'LatexParseError';
    }
}

/**
 * Erreur de validation
 */
export class ValidationError extends ExtensionError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR', true);
        this.name = 'ValidationError';
    }
}