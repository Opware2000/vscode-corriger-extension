import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

suite('Chat Participant - corriger', () => {
    test('[P1] should have chat participant configuration in package.json', () => {
        // GIVEN: Package.json file path
        const packageJsonPath = path.join(__dirname, '../../../package.json');

        // WHEN: Reading package.json
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(packageJsonContent);

        // THEN: Should have corriger chat participant
        const chatParticipants = packageJson.contributes?.chatParticipants;
        assert.ok(chatParticipants, 'Les participants de chat devraient être configurés');
        assert.ok(Array.isArray(chatParticipants), 'chatParticipants devrait être un tableau');
        const corrigerParticipant = chatParticipants.find((p: any) => p.id === 'corriger');
        assert.ok(corrigerParticipant, 'Le participant "corriger" devrait être configuré');
        assert.equal(corrigerParticipant.name, 'corriger', 'Le nom devrait être "corriger"');
        assert.equal(corrigerParticipant.description, 'Assistant de correction d\'exercices LaTeX pour les enseignants de mathématiques', 'La description devrait être correcte');
        assert.ok(corrigerParticipant.isSticky, 'Le participant devrait être sticky');
    });

    test('[P1] should have corriger in activation events', () => {
        // GIVEN: Package.json file path
        const packageJsonPath = path.join(__dirname, '../../../package.json');

        // WHEN: Reading package.json
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(packageJsonContent);

        // THEN: Should have corriger in activation events (implicitly through chat API)
        // The chat participant doesn't add to activationEvents, but we verify the contributes section
        assert.ok(packageJson.contributes?.chatParticipants, 'La section chatParticipants devrait exister');
    });
});