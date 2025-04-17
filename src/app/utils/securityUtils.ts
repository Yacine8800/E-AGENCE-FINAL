// securityUtils.ts - Utilitaires de sécurité
import { v4 as uuidv4 } from 'uuid';

/**
 * Génère un identifiant unique et cryptographiquement sécurisé
 * @returns un UUID v4 sous forme de chaîne
 */
export const generateSecureId = (): string => {
  return uuidv4();
};

/**
 * Valide et nettoie une chaîne pour prévenir les injections
 * @param input la chaîne à valider
 * @returns la chaîne nettoyée ou une chaîne vide si invalide
 */
export const sanitizeString = (input: string | null | undefined): string => {
  if (!input) return '';
  
  // Supprime les caractères potentiellement dangereux
  return input
    .replace(/<[^>]*>/g, '') // Supprime les balises HTML
    .trim();
};

/**
 * Valide un objet avant sérialisation JSON
 * @param obj L'objet à valider
 * @returns L'objet sécurisé pour la sérialisation
 */
export const validateAndSanitizeForJSON = (obj: any): any => {
  if (!obj) return null;
  
  // Si c'est une chaîne, on la nettoie directement
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  // Si c'est un tableau, on valide chaque élément
  if (Array.isArray(obj)) {
    return obj.map(item => validateAndSanitizeForJSON(item));
  }
  
  // Si c'est un objet, on valide chaque propriété
  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      result[key] = validateAndSanitizeForJSON(value);
    }
    
    return result;
  }
  
  // Pour les types primitifs (number, boolean, etc.), on les retourne tels quels
  return obj;
};

/**
 * Fonction de sérialisation JSON sécurisée
 * @param obj L'objet à sérialiser
 * @returns La chaîne JSON sécurisée
 */
export const secureJSONStringify = (obj: any): string => {
  const sanitizedObj = validateAndSanitizeForJSON(obj);
  return JSON.stringify(sanitizedObj);
};
