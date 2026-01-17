import * as vscode from 'vscode';

/**
 * Nom de l'extension pour la configuration VSCode
 */
export const EXTENSION_NAME = 'vscode-corriger-extension';

/**
 * Niveaux de log disponibles
 */
export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug'
}

/**
 * Fournisseurs d'IA disponibles
 */
export enum AIProvider {
    OPENAI = 'openai',
    COPILOT = 'copilot'
}

/**
 * Modèles OpenAI disponibles
 */
export enum OpenAIModel {
    GPT_5_MINI = 'gpt-5-mini',
    GPT_5 = 'gpt-5',
    GPT_4O = 'gpt-4o',
    // ... autres modèles
}

/**
 * Récupère une valeur de configuration avec valeur par défaut
 * @param key Clé de configuration
 * @param defaultValue Valeur par défaut
 * @returns Valeur de configuration
 */
export function getConfig<T>(key: string, defaultValue: T): T {
    const config = vscode.workspace.getConfiguration(EXTENSION_NAME);
    return config.get(key, defaultValue);
}