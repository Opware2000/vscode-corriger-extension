/**
 * Constants for the vscode-corriger-extension
 */

// User-facing messages
export const MESSAGES = {
    NO_DOCUMENT: 'Aucun document ouvert ou document vide.',
    NO_EXERCISES_FOUND: 'Aucun exercice détecté dans le document.',
    EXERCISES_DETECTED: (count: number) => `${count} exercice(s) détecté(s) dans le document.`,
    EXERCISE_SELECTED: (number: number) => `Exercice ${number} sélectionné pour correction.`,
    SELECT_EXERCISE_PLACEHOLDER: 'Sélectionnez un exercice à corriger',
    EXERCISE_DETAIL: (start: number, end: number) => `Lignes ${start}-${end}`
} as const;

// Decoration styles
export const DECORATION_STYLES = {
    EXERCISE_HIGHLIGHT_BACKGROUND: 'rgba(255, 255, 0, 0.3)',
    EXERCISE_HIGHLIGHT_BORDER: '2px solid rgba(255, 255, 0, 0.8)',
    EXERCISE_HIGHLIGHT_BORDER_RADIUS: '3px'
} as const;