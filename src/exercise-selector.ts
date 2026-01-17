import * as vscode from 'vscode';
import { Exercise } from './latex-parser';
import { DECORATION_STYLES, MESSAGES } from './constants';

/**
 * Interface for QuickPick items that include exercise data
 */
export interface ExerciseQuickPickItem extends vscode.QuickPickItem {
    exercise: Exercise;
}

// Type de décoration pour la mise en surbrillance des exercices
const exerciseHighlightDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: DECORATION_STYLES.EXERCISE_HIGHLIGHT_BACKGROUND,
    border: DECORATION_STYLES.EXERCISE_HIGHLIGHT_BORDER,
    borderRadius: DECORATION_STYLES.EXERCISE_HIGHLIGHT_BORDER_RADIUS
});

/**
 * Met en surbrillance un exercice dans l'éditeur actif
 * @param exercise L'exercice à mettre en surbrillance
 */
export function highlightExercise(exercise: Exercise): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const range = new vscode.Range(
        editor.document.positionAt(exercise.start),
        editor.document.positionAt(exercise.end)
    );

    editor.setDecorations(exerciseHighlightDecorationType, [range]);
}

/**
 * Efface toutes les mises en surbrillance d'exercices
 */
export function clearExerciseHighlights(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    editor.setDecorations(exerciseHighlightDecorationType, []);
}

/**
 * Affiche une interface QuickPick pour sélectionner un exercice parmi la liste détectée
 * @param exercises Liste des exercices détectés
 * @returns L'exercice sélectionné ou undefined si annulé
 */
export async function selectExercise(exercises: Exercise[]): Promise<Exercise | undefined> {
    if (exercises.length === 0) {
        vscode.window.showInformationMessage(MESSAGES.NO_EXERCISES_FOUND);
        return undefined;
    }

    const items: ExerciseQuickPickItem[] = exercises.map(exercise => ({
        label: `Exercice ${exercise.number}`,
        description: exercise.title,
        detail: MESSAGES.EXERCISE_DETAIL(exercise.start, exercise.end),
        exercise: exercise
    }));

    const selectedItem = await vscode.window.showQuickPick(items, {
        placeHolder: MESSAGES.SELECT_EXERCISE_PLACEHOLDER,
        matchOnDescription: true,
        matchOnDetail: true
    });

    if (!selectedItem) {
        return undefined; // Sélection annulée
    }

    const selectedExercise = (selectedItem as ExerciseQuickPickItem).exercise;
    highlightExercise(selectedExercise);
    return selectedExercise;
}