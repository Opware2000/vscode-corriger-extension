import * as vscode from 'vscode';

/**
 * Logger utility pour l'extension VSCode
 */
class ExtensionLogger {
    private outputChannel: vscode.OutputChannel;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('VSCode Corriger Extension');
    }

    /**
     * Vérifie si le niveau de log est autorisé
     */
    private shouldLog(level: 'error' | 'warn' | 'info' | 'debug'): boolean {
        const logLevel = vscode.workspace.getConfiguration('vscode-corriger-extension').get('logLevel', 'info') as string;
        const levels = ['error', 'warn', 'info', 'debug'];
        const currentLevelIndex = levels.indexOf(logLevel);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex <= currentLevelIndex;
    }

    /**
     * Log un message d'information
     */
    info(message: string, ...args: any[]): void {
        if (!this.shouldLog('info')) {return;}
        const formattedMessage = `[INFO] ${new Date().toISOString()} - ${message}`;
        this.outputChannel.appendLine(formattedMessage);
        if (args.length > 0) {
            this.outputChannel.appendLine(`  Details: ${JSON.stringify(args, null, 2)}`);
        }
    }

    /**
     * Log un message d'avertissement
     */
    warn(message: string, ...args: any[]): void {
        if (!this.shouldLog('warn')) {return;}
        const formattedMessage = `[WARN] ${new Date().toISOString()} - ${message}`;
        this.outputChannel.appendLine(formattedMessage);
        if (args.length > 0) {
            this.outputChannel.appendLine(`  Details: ${JSON.stringify(args, null, 2)}`);
        }
    }

    /**
     * Log un message d'erreur
     */
    error(message: string, error?: Error): void {
        if (!this.shouldLog('error')) {return;}
        const formattedMessage = `[ERROR] ${new Date().toISOString()} - ${message}`;
        this.outputChannel.appendLine(formattedMessage);
        if (error) {
            this.outputChannel.appendLine(`  Error: ${error.message}`);
            if (error.stack) {
                this.outputChannel.appendLine(`  Stack: ${error.stack}`);
            }
        }
    }

    /**
     * Log un message de debug
     */
    debug(message: string, ...args: any[]): void {
        if (!this.shouldLog('debug')) {return;}
        const formattedMessage = `[DEBUG] ${new Date().toISOString()} - ${message}`;
        this.outputChannel.appendLine(formattedMessage);
        if (args.length > 0) {
            this.outputChannel.appendLine(`  Details: ${JSON.stringify(args, null, 2)}`);
        }
    }

    /**
     * Affiche le canal de sortie
     */
    show(): void {
        this.outputChannel.show();
    }
}

// Instance globale du logger
export const logger = new ExtensionLogger();