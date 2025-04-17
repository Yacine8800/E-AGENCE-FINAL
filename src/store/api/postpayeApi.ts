import { apiSlice } from "./apiSlice";

// Types pour le rattachement des postpayés
export interface PostpayeVerifyRequest {
  identifiant: string;
  label: string;
}

export interface PostpayeVerifyResponse {
  message: string;
  data?: any;
  success?: boolean;
}

// Type pour la liste des compteurs rattachés
export interface RattachementParams {
  page?: number;
  pageSize?: number;
  status?: string;
  q?: string;
  sortBy?: string;
  orderBy?: string;
  statutRattachement?: string;
  type?: string;
}

export interface RattachementItem {
  id: string;
  identifiant: string;
  label?: string;
  status?: string;
  statutRattachement?: string;
  type?: string;
  isAlert?: boolean;
  // Ajoutez d'autres champs selon la structure de l'API
}

export interface RattachementResponse {
  data: RattachementItem[];
  total: number;
  page: number;
  pageSize: number;
  success: boolean;
}

// Extension de l'API slice pour le rattachement des postpayés
export const postpayeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    verifyPostpaye: builder.mutation<PostpayeVerifyResponse, PostpayeVerifyRequest>({
      query: (credentials) => ({
        url: "v3/rattachement/postpaye/verify",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    
    // Nouvelle requête GET pour récupérer la liste des compteurs rattachés
    getRattachements: builder.query<RattachementResponse, RattachementParams>({
      query: (params) => ({
        url: "v3/rattachement",
        method: "GET",
        params,
      }),
      providesTags: ["Meters"],
    }),
  }),
});

// Export des hooks générés automatiquement
export const { 
  useVerifyPostpayeMutation,
  useGetRattachementsQuery 
} = postpayeApi;
