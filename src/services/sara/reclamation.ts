import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Interface pour la personne à contacter
export interface PersonneAContacter {
  firstname: string | null;
  lastname: string | null;
  phone: string | null;
}

// Interface complète pour une réclamation
export interface Reclamation {
  id?: string;
  certifie: boolean;
  codeAgence: string | null;
  codeCommune: string;
  codeNatureSoll: string | null;
  codePrestataire: string | null;
  codeQuartier: string;
  codeSousQuartier: string;
  description: string;
  email: string;
  firstname: string;
  idClient: string | null;
  lastname: string;
  personneAContacter: PersonneAContacter;
  phone: string;
  refClient: string | null;
  // Ajoutez d'autres champs selon vos besoins
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Type pour la création d'une réclamation (sans l'ID)
export type CreateReclamationRequest = Omit<Reclamation, "id">;

// Type pour la mise à jour (tous les champs optionnels sauf l'ID)
export type UpdateReclamationRequest = Partial<Omit<Reclamation, "id">>;

export const reclamationApi = createApi({
  reducerPath: "reclamationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/v3/sara/reclamation",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Reclamation"],
  endpoints: (builder) => ({
    // Liste des réclamations
    getReclamations: builder.query<Reclamation[], void>({
      query: () => "",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Reclamation" as const, id })),
              { type: "Reclamation", id: "LIST" },
            ]
          : [{ type: "Reclamation", id: "LIST" }],
    }),

    // Créer une réclamation
    createReclamation: builder.mutation<Reclamation, CreateReclamationRequest>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Reclamation", id: "LIST" }],
    }),

    // Modifier une réclamation
    updateReclamation: builder.mutation<
      Reclamation,
      { id: string; data: UpdateReclamationRequest }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Reclamation", id },
        { type: "Reclamation", id: "LIST" },
      ],
    }),

    // Détails d'une réclamation
    getReclamationById: builder.query<Reclamation, string>({
      query: (id) => `/details/${id}`,
      providesTags: (result, error, id) => [{ type: "Reclamation", id }],
    }),

    // Détruire une réclamation (hard delete)
    eraseReclamation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/erase/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Reclamation", id },
        { type: "Reclamation", id: "LIST" },
      ],
    }),

    // Supprimer une réclamation (soft delete)
    removeReclamation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/remove/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Reclamation", id },
        { type: "Reclamation", id: "LIST" },
      ],
    }),

    // Restaurer une réclamation
    restoreReclamation: builder.mutation<Reclamation, string>({
      query: (id) => ({
        url: `/restore/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Reclamation", id },
        { type: "Reclamation", id: "LIST" },
      ],
    }),

    // Liste par statut
    findByStatus: builder.query<Reclamation[], string>({
      query: (status) => `/findByStatus?status=${encodeURIComponent(status)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Reclamation" as const, id })),
              { type: "Reclamation", id: "LIST" },
            ]
          : [{ type: "Reclamation", id: "LIST" }],
    }),

    // Soumettre une demande de réclamation
    submitDemande: builder.mutation<Reclamation, string>({
      query: (id) => ({
        url: `/submit-demand/${id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Reclamation", id },
        { type: "Reclamation", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetReclamationsQuery,
  useCreateReclamationMutation,
  useUpdateReclamationMutation,
  useGetReclamationByIdQuery,
  useEraseReclamationMutation,
  useRemoveReclamationMutation,
  useRestoreReclamationMutation,
  useFindByStatusQuery,
  useSubmitDemandeMutation,
} = reclamationApi;
