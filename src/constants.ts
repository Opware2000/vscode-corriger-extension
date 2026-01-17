/**
 * Constants for the vscode-corriger-extension
 */

// Timeouts and limits
export const TIMEOUTS = {
    COPILOT_REQUEST: 30000, // 30 seconds for Copilot API calls
    OPENAI_REQUEST: 30000, // 30 seconds for OpenAI API calls
    COPILOT_TEST: 1000, // 1 second for test timeouts
    RATE_LIMIT_WINDOW: 60000, // 1 minute window for rate limiting
} as const;

export const LIMITS = {
    MAX_REQUESTS_PER_WINDOW: 10, // Maximum Copilot requests per time window
    MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB max document size
    MAX_EXERCISES_CACHE: 100, // Maximum exercises to cache
    CORRECTION_CACHE_SIZE: 50, // Default correction cache size
    EXERCISE_CACHE_SIZE: 10, // Default exercise cache size
} as const;

// User-facing messages
export const MESSAGES = {
    NO_DOCUMENT: 'Aucun document ouvert ou document vide.',
    NO_EXERCISES_FOUND: 'Aucun exercice détecté dans le document.',
    EXERCISES_DETECTED: (count: number) => `${count} exercice(s) détecté(s) dans le document.`,
    EXERCISE_SELECTED: (number: number) => `Exercice ${number} sélectionné pour correction.`,
    SELECT_EXERCISE_PLACEHOLDER: 'Sélectionnez un exercice à corriger',
    EXERCISE_DETAIL: (start: number, end: number) => `Positions ${start}-${end}`,
    COPILOT_UNAVAILABLE: 'Copilot n\'est pas disponible. Vérifiez que GitHub Copilot Chat est installé et activé.',
    GENERATION_CANCELLED: 'Génération de correction annulée par l\'utilisateur.',
    RATE_LIMIT_EXCEEDED: 'Trop de requêtes. Veuillez patienter avant de réessayer.',
    CORRECTION_GENERATED: 'Correction générée et insérée avec succès.',
    EXERCISE_ALREADY_CORRECTED: 'Cet exercice a déjà une correction.',
} as const;

// Error codes
export const ERROR_CODES = {
    COPILOT_UNAVAILABLE: 'COPILOT_UNAVAILABLE',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    GENERATION_CANCELLED: 'GENERATION_CANCELLED',
    LATEX_PARSE_ERROR: 'LATEX_PARSE_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

// Decoration styles
export const DECORATION_STYLES = {
    EXERCISE_HIGHLIGHT_BACKGROUND: 'rgba(255, 255, 0, 0.3)',
    EXERCISE_HIGHLIGHT_BORDER: '2px solid rgba(255, 255, 0, 0.8)',
    EXERCISE_HIGHLIGHT_BORDER_RADIUS: '3px'
} as const;