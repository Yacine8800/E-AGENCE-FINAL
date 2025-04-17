// validationSchemas.ts - Schémas de validation pour les données
import { z } from 'zod';

// Schéma pour valider les boutons interactifs
export const buttonSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.string().min(1)
});

// Schéma pour valider les éléments de liste
export const listItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional()
});

// Schéma pour valider les champs de formulaire
export const formFieldSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  required: z.boolean(),
  value: z.string(),
  type: z.enum(["number", "string", "Date", "Datetime", "Image"])
});

// Schéma pour valider les messages entrants MQTT
export const inboundMessageSchema = z.object({
  clientId: z.string().min(1),
  from: z.string(),
  integrationType: z.string(),
  messageId: z.string().min(1),
  sendedAt: z.string().datetime(),
  to: z.string(),
  message: z.object({
    type: z.string().min(1),
    content: z.string().optional(),
    text: z.string().optional(),
    caption: z.string().optional(),
    buttons: z.array(buttonSchema).optional(),
    list: z.array(listItemSchema).optional(),
    selector: z.enum(["unique", "multiple"]).optional(),
    fields: z.array(formFieldSchema).optional(),
    type_request: z.string().optional(),
    status: z.string().optional(),
    url: z.string().url().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional()
  })
});

// Schéma pour valider les messages sortants MQTT
export const outboundMessageSchema = z.object({
  clientId: z.string().min(1),
  from: z.string().min(1),
  integrationType: z.string().min(1),
  sendedAt: z.string().datetime(),
  messageId: z.string().min(1),
  UrlWebhook: z.string().url(),
  to: z.string().min(1),
  message: z.object({
    type: z.string().min(1)
  }).passthrough() // Permettre des champs supplémentaires selon le type de message
});

// Fonction de validation avec gestion d'erreurs structurée
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean; 
  data?: T; 
  errors?: z.ZodError 
} => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error; // Relancer les autres types d'erreurs
  }
};
