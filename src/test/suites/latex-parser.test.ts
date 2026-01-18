import * as assert from 'assert';
import { detectExercises, parseExerciseStructure, Exercise, ExerciseStatus } from '../../latex-parser';

// Test data factories
const createLatexWithExercises = (count: number, overrides: string[] = []): string => {
    const exercises = [];
    for (let i = 0; i < count; i++) {
        const content = overrides[i] || `Contenu de l'exercice ${i + 1}`;
        exercises.push(`\\begin{exercice}\n${content}\n\\end{exercice}`);
    }
    return exercises.join('\n\n');
};

const createExerciseWithStructure = (options: {
    enonce?: string;
    correction?: string;
    otherContent?: string;
}): string => {
    let content = '\\begin{exercice}\n';
    if (options.enonce) {
        content += `\\begin{enonce}\n${options.enonce}\n\\end{enonce}\n`;
    }
    if (options.correction) {
        content += `\\begin{correction}\n${options.correction}\n\\end{correction}\n`;
    }
    if (options.otherContent) {
        content += options.otherContent + '\n';
    }
    content += '\\end{exercice}';
    return content;
};

suite('detectExercises', () => {
    test('[P1] should detect single exercise in LaTeX content', () => {
        // GIVEN: LaTeX content with one exercise
        const latexContent = createLatexWithExercises(1);

        // WHEN: Detecting exercises
        const exercises = detectExercises(latexContent);

        // THEN: Returns array with one exercise
        assert.ok(Array.isArray(exercises));
        assert.strictEqual(exercises.length, 1);
        assert.strictEqual(exercises[0].number, 1);
        assert.strictEqual(typeof exercises[0].start, 'number');
        assert.strictEqual(typeof exercises[0].end, 'number');
        assert.ok(exercises[0].content.includes('\\begin{exercice}'));
        assert.ok(exercises[0].content.includes('\\end{exercice}'));
    });

    test('[P1] should detect multiple exercises in LaTeX content', () => {
        // GIVEN: LaTeX content with three exercises
        const latexContent = createLatexWithExercises(3);

        // WHEN: Detecting exercises
        const exercises = detectExercises(latexContent);

        // THEN: Returns array with three exercises
        assert.ok(Array.isArray(exercises));
        assert.strictEqual(exercises.length, 3);
        exercises.forEach((exercise: Exercise, index: number) => {
            assert.strictEqual(exercise.number, index + 1);
            assert.strictEqual(typeof exercise.start, 'number');
            assert.strictEqual(typeof exercise.end, 'number');
            assert.ok(exercise.content.includes(`Contenu de l'exercice ${index + 1}`));
        });
    });

    test('[P1] should return empty array when no exercises found', () => {
        // GIVEN: LaTeX content without exercises
        const latexContent = `
\\begin{document}
Voici du contenu LaTeX normal sans exercices.
\\end{document}
`;

        // WHEN: Detecting exercises
        const exercises = detectExercises(latexContent);

        // THEN: Returns empty array
        assert.ok(Array.isArray(exercises));
        assert.strictEqual(exercises.length, 0);
    });

    test('[P2] should handle exercises with complex content', () => {
        // GIVEN: Exercise with complex LaTeX content
        const complexContent = `
\\begin{exercice}
\\begin{enonce}
Résoudre l'équation $x^2 + 2x + 1 = 0$.
\\end{enonce}
\\begin{correction}
$(x+1)^2 = 0$ donc $x = -1$.
\\end{correction}
\\end{exercice}
`;

        // WHEN: Detecting exercises
        const exercises = detectExercises(complexContent);

        // THEN: Correctly detects the exercise
        assert.strictEqual(exercises.length, 1);
        assert.ok(exercises[0].content.includes('x^2 + 2x + 1 = 0'));
    });

    test('[P2] should handle exercises at document boundaries', () => {
        // GIVEN: Exercise at the start and end of document
        const boundaryContent = `\\begin{exercice}
Premier exercice
\\end{exercice}

Du texte intermédiaire

\\begin{exercice}
Dernier exercice
\\end{exercice}`;

        // WHEN: Detecting exercises
        const exercises = detectExercises(boundaryContent);

        // THEN: Detects both exercises correctly
        assert.strictEqual(exercises.length, 2);
        assert.ok(exercises[0].content.includes('Premier exercice'));
        assert.ok(exercises[1].content.includes('Dernier exercice'));
    });

    test('[P3] should handle malformed exercises gracefully', () => {
        // GIVEN: Content with malformed exercise tags
        const malformedContent = `
\\begin{exercice}
Exercice valide
\\end{exercice}

\\begin{exercice}
Exercice sans fin

Du texte après
`;

        // WHEN: Detecting exercises
        const exercises = detectExercises(malformedContent);

        // THEN: Only detects the valid exercise
        assert.strictEqual(exercises.length, 1);
        assert.ok(exercises[0].content.includes('Exercice valide'));
    });

    test('[P3] should handle large documents with many exercises', () => {
        // GIVEN: Large document with 100 exercises
        const largeContent = createLatexWithExercises(100);

        // WHEN: Detecting exercises
        const exercises = detectExercises(largeContent);

        // THEN: Detects all exercises correctly
        assert.strictEqual(exercises.length, 100);
        exercises.forEach((exercise: Exercise, index: number) => {
            assert.strictEqual(exercise.number, index + 1);
            assert.ok(exercise.content.includes(`Contenu de l'exercice ${index + 1}`));
        });
    });

    test('[P3] should handle very large documents efficiently', () => {
        // GIVEN: Very large document with 1000 exercises
        const veryLargeContent = createLatexWithExercises(1000);

        // WHEN: Detecting exercises
        const startTime = Date.now();
        const exercises = detectExercises(veryLargeContent);
        const endTime = Date.now();

        // THEN: Detects all exercises and completes within reasonable time (< 1 second)
        assert.strictEqual(exercises.length, 1000);
        assert.ok(endTime - startTime < 1000, `Detection took ${endTime - startTime}ms, should be < 1000ms`);
    });

    test('[P3] should handle deeply nested malformed structures', () => {
        // GIVEN: Content with deeply nested malformed tags
        const nestedMalformedContent = `
\\begin{exercice}
\\begin{enonce}
\\begin{exercice}
Exercice imbriqué
\\end{exercice}
\\end{enonce}
\\end{exercice}
`;

        // WHEN: Detecting exercises
        const exercises = detectExercises(nestedMalformedContent);

        // THEN: Detects the outer exercise
        assert.strictEqual(exercises.length, 1);
        assert.ok(exercises[0].content.includes('Exercice imbriqué'));
    });

    test('[P3] should handle exercises with special regex characters', () => {
        // GIVEN: Content with regex special characters in exercises
        const specialCharsContent = '\\begin{exercice}\nContenu avec .*+?^${}()|[]\\\\\n\\end{exercice}';

        // WHEN: Detecting exercises
        const exercises = detectExercises(specialCharsContent);

        // THEN: Detects the exercise correctly
        assert.strictEqual(exercises.length, 1);
        assert.ok(exercises[0].content.includes('.*+?^${}()|[]\\\\'));
    });

    test('[P2] should generate titles from enonce content', () => {
        // GIVEN: Exercise with enonce
        const content = `\\begin{exercice}
\\begin{enonce}
Résoudre l'équation
\\end{enonce}
\\end{exercice}`;

        // WHEN: Detecting exercises
        const exercises = detectExercises(content);

        // THEN: Title is extracted from enonce
        assert.strictEqual(exercises.length, 1);
        assert.strictEqual(exercises[0].title, 'Résoudre l\'équation');
    });

    test('[P2] should generate default title when no enonce', () => {
        // GIVEN: Exercise without enonce
        const content = `\\begin{exercice}
Contenu sans enonce
\\end{exercice}`;

        // WHEN: Detecting exercises
        const exercises = detectExercises(content);

        // THEN: Default title is used
        assert.strictEqual(exercises.length, 1);
        assert.strictEqual(exercises[0].title, 'Exercice 1');
    });

    test('[P2] should truncate long enonce titles', () => {
        // GIVEN: Exercise with long enonce
        const longEnonce = 'A'.repeat(60);
        const content = `\\begin{exercice}
\\begin{enonce}
${longEnonce}
\\end{enonce}
\\end{exercice}`;

        // WHEN: Detecting exercises
        const exercises = detectExercises(content);

        // THEN: Title is truncated
        assert.strictEqual(exercises.length, 1);
        assert.ok(exercises[0].title!.endsWith('...'));
        assert.strictEqual(exercises[0].title!.length, 53); // 50 + '...'
    });

    test('[P1] should mark exercises with correction as IGNORED', () => {
        // GIVEN: Exercise with correction
        const content = `\\begin{exercice}
\\begin{enonce}
Résoudre x + 1 = 0
\\end{enonce}
\\begin{correction}
x = -1
\\end{correction}
\\end{exercice}`;

        // WHEN: Detecting exercises
        const exercises = detectExercises(content);

        // THEN: Exercise is marked as IGNORED
        assert.strictEqual(exercises.length, 1);
        assert.strictEqual(exercises[0].status, ExerciseStatus.IGNORED);
    });

    test('[P1] should mark exercises without correction as PENDING', () => {
        // GIVEN: Exercise without correction
        const content = `\\begin{exercice}
\\begin{enonce}
Résoudre x + 1 = 0
\\end{enonce}
\\end{exercice}`;

        // WHEN: Detecting exercises
        const exercises = detectExercises(content);

        // THEN: Exercise is marked as PENDING
        assert.strictEqual(exercises.length, 1);
        assert.strictEqual(exercises[0].status, ExerciseStatus.PENDING);
    });

    test('[P2] should handle exercises with malformed correction gracefully', () => {
        // GIVEN: Exercise with malformed correction (missing end tag)
        const content = `\\begin{exercice}
\\begin{enonce}
Résoudre x + 1 = 0
\\end{enonce}
\\begin{correction}
x = -1
Contenu après sans end
\\end{exercice}`;

        // WHEN: Detecting exercises
        const exercises = detectExercises(content);

        // THEN: Exercise is marked as PENDING due to malformed correction
        assert.strictEqual(exercises.length, 1);
        assert.strictEqual(exercises[0].status, ExerciseStatus.PENDING);
    });
});

suite('parseExerciseStructure', () => {
    test('[P1] should extract enonce from exercise content', () => {
        // GIVEN: Exercise with enonce only
        const exerciseContent = createExerciseWithStructure({
            enonce: 'Voici l\'énoncé de l\'exercice.'
        });

        // WHEN: Parsing exercise structure
        const structure = parseExerciseStructure(exerciseContent);

        // THEN: Extracts enonce correctly
        assert.ok(structure);
        assert.strictEqual(structure.enonce, 'Voici l\'énoncé de l\'exercice.');
        assert.strictEqual(structure.correction, undefined);
        assert.strictEqual(structure.otherContent, undefined);
    });

    test('[P1] should extract correction from exercise content', () => {
        // GIVEN: Exercise with correction only
        const exerciseContent = createExerciseWithStructure({
            correction: 'Voici la correction de l\'exercice.'
        });

        // WHEN: Parsing exercise structure
        const structure = parseExerciseStructure(exerciseContent);

        // THEN: Extracts correction correctly
        assert.ok(structure);
        assert.strictEqual(structure.correction, 'Voici la correction de l\'exercice.');
        assert.strictEqual(structure.enonce, undefined);
    });

    test('[P1] should extract both enonce and correction', () => {
        // GIVEN: Exercise with both enonce and correction
        const exerciseContent = createExerciseWithStructure({
            enonce: 'Résoudre x + 1 = 0',
            correction: 'x = -1'
        });

        // WHEN: Parsing exercise structure
        const structure = parseExerciseStructure(exerciseContent);

        // THEN: Extracts both correctly
        assert.ok(structure);
        assert.strictEqual(structure.enonce, 'Résoudre x + 1 = 0');
        assert.strictEqual(structure.correction, 'x = -1');
    });

    test('[P2] should extract other content when present', () => {
        // GIVEN: Exercise with enonce, correction, and other content
        const exerciseContent = createExerciseWithStructure({
            enonce: 'Énoncé principal',
            correction: 'Correction principale',
            otherContent: 'Contenu supplémentaire et notes'
        });

        // WHEN: Parsing exercise structure
        const structure = parseExerciseStructure(exerciseContent);

        // THEN: Extracts all parts correctly
        assert.ok(structure);
        assert.strictEqual(structure.enonce, 'Énoncé principal');
        assert.strictEqual(structure.correction, 'Correction principale');
        assert.strictEqual(structure.otherContent, 'Contenu supplémentaire et notes');
    });

    test('[P2] should handle exercise with only other content', () => {
        // GIVEN: Exercise with only other content
        const exerciseContent = createExerciseWithStructure({
            otherContent: 'Contenu sans structure particulière'
        });

        // WHEN: Parsing exercise structure
        const structure = parseExerciseStructure(exerciseContent);

        // THEN: Extracts other content correctly
        assert.ok(structure);
        assert.strictEqual(structure.otherContent, 'Contenu sans structure particulière');
    });

    test('[P2] should trim whitespace from extracted content', () => {
        // GIVEN: Exercise with extra whitespace
        const exerciseContent = `\\begin{exercice}
\\begin{enonce}

  Énoncé avec espaces

\\end{enonce}
\\begin{correction}
  Correction avec espaces
\\end{correction}
\\end{exercice}`;

        // WHEN: Parsing exercise structure
        const structure = parseExerciseStructure(exerciseContent);

        // THEN: Trims whitespace correctly
        assert.strictEqual(structure.enonce, 'Énoncé avec espaces');
        assert.strictEqual(structure.correction, 'Correction avec espaces');
    });

    test('[P3] should handle empty exercise gracefully', () => {
        // GIVEN: Empty exercise
        const exerciseContent = '\\begin{exercice}\\end{exercice}';

        // WHEN: Parsing exercise structure
        const structure = parseExerciseStructure(exerciseContent);

        // THEN: Returns empty structure
        assert.ok(structure);
        assert.strictEqual(structure.enonce, undefined);
        assert.strictEqual(structure.correction, undefined);
        assert.strictEqual(structure.otherContent, undefined);
    });

    test('[P3] should handle malformed structure gracefully', () => {
        // GIVEN: Exercise with malformed tags
        const exerciseContent = `\\begin{exercice}
\\begin{enonce}
Énoncé valide
\\end{enonce}
\\begin{correction}
Correction sans fin
Contenu restant
\\end{exercice}`;

        // WHEN: Parsing exercise structure
        const structure = parseExerciseStructure(exerciseContent);

        // THEN: Extracts what it can
        assert.ok(structure);
        assert.strictEqual(structure.enonce, 'Énoncé valide');
        assert.strictEqual(structure.otherContent, '\\begin{correction}\nCorrection sans fin\nContenu restant');
    });
});