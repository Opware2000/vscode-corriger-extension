import * as assert from 'assert';
import { detectExercises, parseExerciseStructure } from '../../latex-parser';

suite('Integration Tests', () => {
    test('[P1] should detect and parse multiple exercises correctly', () => {
        // GIVEN: LaTeX content with multiple structured exercises
        const latexContent = `
\\begin{exercice}
\\begin{enonce}
Premier énoncé
\\end{enonce}
\\begin{correction}
Première correction
\\end{correction}
\\end{exercice}

\\begin{exercice}
\\begin{enonce}
Deuxième énoncé
\\end{enonce}
\\end{exercice}
`;

        // WHEN: Detecting and parsing exercises
        const exercises = detectExercises(latexContent);
        const structures = exercises.map(ex => parseExerciseStructure(ex.content));

        // THEN: Correctly processes all exercises
        assert.strictEqual(exercises.length, 2);
        assert.strictEqual(structures[0].enonce, 'Premier énoncé');
        assert.strictEqual(structures[0].correction, 'Première correction');
        assert.strictEqual(structures[1].enonce, 'Deuxième énoncé');
        assert.strictEqual(structures[1].correction, undefined);
    });
});