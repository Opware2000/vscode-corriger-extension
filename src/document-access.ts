import * as vscode from 'vscode';

/**
 * Récupère le contenu du document actif dans l'éditeur VS Code
 * @returns Le contenu du document actif ou une chaîne vide si aucun document n'est ouvert
 */
export function getActiveDocumentContent(): string {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        return activeEditor.document.getText();
    }
    return '';
}