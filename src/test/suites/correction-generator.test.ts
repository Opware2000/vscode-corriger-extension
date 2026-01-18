import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { generateCorrection, generatePedagogicalPrompt } from '../../correction-generator';

suite('Correction Generator', () => {
    let sandbox: sinon.SinonSandbox;

    suiteSetup(() => {
        sandbox = sinon.createSandbox();
    });

    suiteTeardown(() => {
        sandbox.restore();
    });

    test('[P1] should generate pedagogical prompt with French adaptations using default config', () => {
        // GIVEN: Mock configuration with default pedagogicalPrompt
        const defaultPrompt = `Vous êtes un professeur de mathématiques expérimenté enseignant en France. Voici un exercice LaTeX du programme français de mathématiques :

{{exerciseContent}}{{documentContext}}

Générez une correction pédagogique complète et détaillée en français, adaptée au niveau lycée. La correction doit :

- Respecter strictement le programme officiel français de mathématiques
- Utiliser le vocabulaire mathématique français approprié :
  * calculer au lieu de "calculate"
  * simplifier au lieu de "simplify"
  * résoudre au lieu de "solve"
  * démontrer au lieu de "prove"
  * conclure au lieu de "conclude"
  * donc au lieu de "therefore"
  * car au lieu de "because"

- Respecter les notations mathématiques françaises :
  * Probabilités conditionnelles : utiliser P_A(B) au lieu de P(B|A) (exemple : P_A(B) = 0,3)
  * Espérance : E[X] (exemple : E[X] = 5)
  * Variance : V(X) (exemple : V(X) = 2,5)
  * Écart-type : σ(X) (exemple : σ(X) = 1,58)
  * Moyenne : $\\bar{x}$ (exemple : $\\bar{x} = 4,2$)
  * Médiane : Me (exemple : Me = 3)
  * Mode : Mo (exemple : Mo = 2)
  * Intervalles : ]a,b[ pour ouvert, [a,b] pour fermé
  * Ensembles : $\\mathbb{N}$ naturels, $\\mathbb{Z}$ entiers, $\\mathbb{Q}$ rationnels, $\\mathbb{R}$ réels
  * Fonctions : f: x $\\mapsto$ f(x) (exemple : f: x $\\mapsto$ x²)
  * Nombres décimaux : utiliser la virgule (3,14 au lieu de 3.14)
  * Grands nombres : utiliser l'espace (1 000 000 au lieu de 1,000,000)

- Expliquer chaque étape clairement et pédagogiquement
- Utiliser un langage accessible aux élèves de lycée
- Inclure des justifications mathématiques rigoureuses
- Respecter les conventions pédagogiques françaises
- Être structurée de manière logique et progressive
- Inclure des diagrammes TikZ si nécessaire pour les problèmes de géométrie
- Fournir des exemples concrets quand cela aide la compréhension

Répondez uniquement avec le contenu de la correction en code LaTeX valide, sans balises \\begin{correction} ou \\end{correction}.`;
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            get: sandbox.stub().callsFake((key: string) => {
                if (key === 'pedagogicalPrompt') {
                    return defaultPrompt;
                }
                return '';
            })
        } as any);

        // Sample exercise content
        const exerciseContent = '\\begin{exercice}\nRésoudre x + 1 = 0\n\\end{exercice}';

        // WHEN: Generating pedagogical prompt
        const prompt = generatePedagogicalPrompt(exerciseContent);

        // THEN: Prompt includes French adaptations
        assert.ok(typeof prompt === 'string');
        assert.ok(prompt.includes('professeur de mathématiques expérimenté enseignant en France'));
        assert.ok(prompt.includes('programme officiel français de mathématiques'));
        assert.ok(prompt.includes('vocabulaire mathématique français approprié'));
        assert.ok(prompt.includes('notations mathématiques françaises'));
        assert.ok(prompt.includes('P_A(B)')); // Probability conditional notation
        assert.ok(prompt.includes('calculer')); // French vocabulary
        assert.ok(prompt.includes('simplifier')); // French vocabulary
        assert.ok(prompt.includes('résoudre')); // French vocabulary
        assert.ok(prompt.includes('démontrer')); // French vocabulary
        assert.ok(prompt.includes('conclure')); // French vocabulary
        assert.ok(prompt.includes('donc')); // French vocabulary
        assert.ok(prompt.includes('car')); // French vocabulary
        assert.ok(prompt.includes(exerciseContent));
    });

    test('[P2] should explicitly specify French conditional probability notation P_A(B) instead of P(B|A)', () => {
        // GIVEN: Mock empty configuration (uses default)
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            get: sandbox.stub().returns('')
        } as any);

        // Sample exercise content with conditional probability
        const exerciseContent = '\\begin{exercice}\nCalculer P(A|B) pour deux événements A et B.\n\\end{exercice}';

        // WHEN: Generating pedagogical prompt
        const prompt = generatePedagogicalPrompt(exerciseContent);

        // THEN: Prompt explicitly specifies using P_A(B) notation
        assert.ok(prompt.includes('P_A(B)')); // Must use French notation
        assert.ok(prompt.includes('au lieu de P(B|A)')); // Explicitly states to use instead of P(B|A)
        assert.ok(prompt.includes('Probabilités conditionnelles')); // Mentions conditional probabilities
    });

    test('[P2] should include comprehensive French mathematical notations in prompts', () => {
        // GIVEN: Mock empty configuration (uses default)
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            get: sandbox.stub().returns('')
        } as any);

        // Sample exercise content
        const exerciseContent = '\\begin{exercice}\nRésoudre le problème statistique.\n\\end{exercice}';

        // WHEN: Generating pedagogical prompt
        const prompt = generatePedagogicalPrompt(exerciseContent);

        // THEN: Prompt includes comprehensive French notations
        assert.ok(prompt.includes('E[X]')); // Expected value
        assert.ok(prompt.includes('V(X)')); // Variance
        assert.ok(prompt.includes('σ(X)')); // Standard deviation
        assert.ok(prompt.includes('\\bar{x}')); // Mean
        assert.ok(prompt.includes('Me')); // Median
        assert.ok(prompt.includes('Mo')); // Mode
        assert.ok(prompt.includes(']a,b[')); // Open interval
        assert.ok(prompt.includes('[a,b]')); // Closed interval
        assert.ok(prompt.includes('\\mathbb{N}')); // Naturals
        assert.ok(prompt.includes('\\mathbb{Z}')); // Integers
        assert.ok(prompt.includes('\\mathbb{Q}')); // Rationals
        assert.ok(prompt.includes('\\mathbb{R}')); // Reals
        assert.ok(prompt.includes('f: x \\mapsto f(x)')); // Function notation
        assert.ok(prompt.includes('virgule')); // Decimal comma
        assert.ok(prompt.includes('espace')); // Number spacing
    });

    test('[P1] should use custom pedagogical prompt from configuration', () => {
        // GIVEN: Mock custom configuration
        const customPrompt = 'Custom prompt with {{exerciseContent}} placeholder';
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            get: sandbox.stub().returns(customPrompt)
        } as any);

        // Sample exercise content
        const exerciseContent = 'Test exercise content';

        // WHEN: Generating pedagogical prompt
        const prompt = generatePedagogicalPrompt(exerciseContent);

        // THEN: Uses custom prompt with placeholder replaced
        assert.strictEqual(prompt, 'Custom prompt with Test exercise content placeholder');
    });

    test('[P1] should generate correction using OpenAI', async () => {
        // GIVEN: Mock OpenAI API
        const mockOpenAIResponse = {
            choices: [{
                message: {
                    content: 'La solution est x = -1'
                }
            }]
        };
        const mockOpenAIClient = {
            chat: {
                completions: {
                    create: sandbox.stub().resolves(mockOpenAIResponse)
                }
            }
        };
        // Mock the OpenAI constructor and getConfig
        sandbox.stub(require('openai'), 'default').returns(mockOpenAIClient);
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            get: sandbox.stub().callsFake((key: string) => {
                if (key === 'openaiApiKey') {
                    return 'test-key';
                }
                if (key === 'openaiModel') {
                    return 'gpt-4';
                }
                if (key === 'openaiTimeout') {
                    return 30000;
                }
                if (key === 'enableCorrectionCache') {
                    return false;
                }
                return undefined;
            })
        } as any);

        // WHEN: Generating correction
        const correction = await generateCorrection('Mock exercise content');

        // THEN: Returns correction with proper LaTeX tags
        assert.ok(typeof correction === 'string');
        assert.ok(correction.includes('\\begin{correction}'));
        assert.ok(correction.includes('\\end{correction}'));
        assert.ok(correction.includes('La solution est x = -1'));
    });

    test('[P2] should handle OpenAI configuration error gracefully', async () => {
        // GIVEN: OpenAI API key not configured
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            get: sandbox.stub().callsFake((key: string) => {
                if (key === 'openaiApiKey') {
                    return '';
                }
                return undefined;
            })
        } as any);

        // WHEN & THEN: Generating correction should throw
        await assert.rejects(async () => {
            await generateCorrection('Mock exercise content');
        }, /Clé API OpenAI non configurée/i);
    });

    test('[P1] should include verification instructions with visual formatting in pedagogical prompt', () => {
        // GIVEN: Mock extension context and file system
        const mockVerificationContent = `# Instructions de vérification automatique des calculs

## Vérification systématique des calculs avec affichage visuel

Avant de fournir votre réponse finale, vous devez vérifier automatiquement l'exactitude de tous les calculs mathématiques présents dans votre correction et utiliser un formatage visuel LaTeX pour indiquer la validation :

### Processus de vérification et affichage :
1. **Identifier tous les calculs** : Repérer chaque opération mathématique (addition, soustraction, multiplication, division, puissances, racines, etc.)
2. **Vérifier étape par étape** : Pour chaque calcul, recalculer mentalement ou logiquement la valeur
3. **Marquer visuellement les calculs vérifiés** : Entourer chaque calcul validé avec \`\\textcolor{green}{}\` pour l'affichage en vert
4. **Marquer les calculs suspects** : Entourer les calculs qui ne peuvent pas être vérifiés ou suspects avec \`\\textcolor{red}{}\` pour l'affichage en rouge
5. **Ajouter commentaires internes** : Maintenir les commentaires LaTeX \`% Calcul vérifié automatiquement\` et \`% Calcul à vérifier manuellement\` pour référence interne`;

        const mockExtensionContext = {
            extensionUri: vscode.Uri.file('/mock/extension/path')
        } as vscode.ExtensionContext;

        // Mock fs.readFileSync
        sandbox.stub(require('fs'), 'readFileSync').returns(mockVerificationContent);

        // Mock configuration
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            get: sandbox.stub().returns('')
        } as any);

        // Sample exercise content
        const exerciseContent = '\\begin{exercice}\nRésoudre x + 1 = 0\n\\end{exercice}';

        // WHEN: Generating pedagogical prompt with extension context
        const prompt = generatePedagogicalPrompt(exerciseContent, undefined, mockExtensionContext);

        // THEN: Prompt includes verification instructions with visual formatting
        assert.ok(prompt.includes('Instructions de vérification automatique des calculs'));
        assert.ok(prompt.includes('affichage visuel'));
        assert.ok(prompt.includes('\\textcolor{green}{}'));
        assert.ok(prompt.includes('\\textcolor{red}{}'));
        assert.ok(prompt.includes('% Calcul vérifié automatiquement'));
        assert.ok(prompt.includes('% Calcul à vérifier manuellement'));
    });
});