import { getConfig } from './config';
import { AIProvider, LogLevel, OpenAIModel } from './config';

/**
 * Service centralisé pour la gestion des configurations de l'extension
 */
export class ConfigService {
    /**
     * Configuration du fournisseur d'IA
     */
    get aiProvider(): AIProvider {
        return getConfig('aiProvider', AIProvider.OPENAI);
    }

    /**
     * Modèle OpenAI à utiliser
     */
    get openAIModel(): OpenAIModel {
        return getConfig('openAIModel', OpenAIModel.GPT_5_MINI);
    }

    /**
     * Niveau de log
     */
    get logLevel(): LogLevel {
        return getConfig('logLevel', LogLevel.INFO);
    }

    /**
     * Activer le cache des exercices
     */
    get enableCache(): boolean {
        return getConfig('enableCache', true);
    }

    /**
     * Taille maximale du cache
     */
    get maxCacheSize(): number {
        return getConfig('maxCacheSize', 100);
    }

    /**
     * Timeout pour les requêtes IA (en millisecondes)
     */
    get aiTimeout(): number {
        return getConfig('aiTimeout', 30000);
    }

    /**
     * Nombre maximum de tentatives de régénération
     */
    get maxRegenerationAttempts(): number {
        return getConfig('maxRegenerationAttempts', 3);
    }

    /**
     * Activer les métriques de performance
     */
    get enablePerformanceMetrics(): boolean {
        return getConfig('enablePerformanceMetrics', false);
    }

    /**
     * Longueur maximale du titre d'exercice pour l'affichage
     */
    get maxExerciseTitleLength(): number {
        return getConfig('maxExerciseTitleLength', 50);
    }
}

// Instance singleton du service de configuration
export const configService = new ConfigService();