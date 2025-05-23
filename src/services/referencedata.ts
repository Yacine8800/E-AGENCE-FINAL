import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

// Types
export interface ReferenceData {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Configuration de l'API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL + "/v3/referencedata" ||
  "http://localhost:3000/api/v3";

// Instance axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const referenceDataApi = createApi({
  reducerPath: "referenceDataApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["ReferenceData"],
  endpoints: (builder) => ({
    getCommunes: builder.query<ReferenceData[], void>({
      query: () => "/donnees-reference/recuperer-commune",
      providesTags: ["ReferenceData"],
    }),
    getQuartiers: builder.query<ReferenceData[], void>({
      query: () => "/donnees-reference/recuperer-quartier",
      providesTags: ["ReferenceData"],
    }),
    getSousQuartiers: builder.query<ReferenceData[], void>({
      query: () => "/donnees-reference/recuperer-sous-quartier",
      providesTags: ["ReferenceData"],
    }),
  }),
});

export const {
  useGetCommunesQuery,
  useGetQuartiersQuery,
  useGetSousQuartiersQuery,
} = referenceDataApi;
