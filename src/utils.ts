/**
 * Utilitaires pour la sécurité et la validation
 */

/**
 * Sanitise le contenu LaTeX pour prévenir les injections dangereuses
 * @param latexContent Le contenu LaTeX à sanitiser
 * @returns Le contenu LaTeX sanitisé
 */
export function sanitizeLatexContent(latexContent: string): string {
    if (!latexContent || typeof latexContent !== 'string') {
        return '';
    }

    // Limiter la taille pour éviter les attaques par déni de service
    const MAX_LATEX_LENGTH = 100000; // 100KB max
    if (latexContent.length > MAX_LATEX_LENGTH) {
        throw new Error(`Contenu LaTeX trop volumineux (${latexContent.length} caractères). Maximum autorisé: ${MAX_LATEX_LENGTH}`);
    }

    let sanitized = latexContent;

    // Supprimer les commandes LaTeX potentiellement dangereuses
    const dangerousCommands = [
        /\\input\s*\{[^}]*\}/gi,  // \input{file} - inclusion de fichiers
        /\\include\s*\{[^}]*\}/gi, // \include{file} - inclusion de fichiers
        /\\usepackage\s*\{[^}]*\}/gi, // \usepackage - chargement de packages
        /\\documentclass\s*\{[^}]*\}/gi, // \documentclass - définition de document
        /\\write\s*\{[^}]*\}/gi, // \write - écriture de fichiers
        /\\immediate\\write\s*\{[^}]*\}/gi, // \immediate\write - écriture immédiate
        /\\openout\s*\{[^}]*\}/gi, // \openout - ouverture de fichiers en écriture
        /\\openin\s*\{[^}]*\}/gi, // \openin - ouverture de fichiers en lecture
        /\\read\s*\{[^}]*\}/gi, // \read - lecture de fichiers
        /\\catcode\s*\{[^}]*\}/gi, // \catcode - modification des codes de caractères
        /\\csname\s*\{[^}]*\}/gi, // \csname - construction de noms de commandes
        /\\expandafter\s*\{[^}]*\}/gi, // \expandafter - expansion différée
    ];

    for (const pattern of dangerousCommands) {
        sanitized = sanitized.replace(pattern, '\\textcolor{red}{COMMANDE INTERDITE}');
    }

    // Supprimer les caractères de contrôle et null bytes
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Échapper les séquences d'échappement suspectes
    sanitized = sanitized.replace(/\\\\/g, '\\textbackslash{}');

    return sanitized;
}

/**
 * Valide qu'un chemin de fichier est sûr (relatif et dans les dossiers autorisés)
 * @param path Le chemin à valider
 * @param allowedDirs Les dossiers autorisés
 * @returns true si le chemin est sûr
 */
export function isSafeFilePath(path: string, allowedDirs: string[] = ['src', 'resources']): boolean {
    if (!path || typeof path !== 'string') {
        return false;
    }

    // Le chemin doit être relatif (pas absolu)
    if (path.startsWith('/') || path.startsWith('\\') || path.includes('..')) {
        return false;
    }

    // Le chemin ne doit pas contenir de caractères dangereux
    if (/[<>:"|?*\x00-\x1F]/.test(path)) {
        return false;
    }

    // Le chemin doit commencer par un dossier autorisé
    const firstSegment = path.split('/')[0] || path.split('\\')[0];
    return allowedDirs.includes(firstSegment);
}