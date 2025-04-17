import { API_URL } from "@/src/app/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Définition de l'URL de base de l'API
const baseUrl = `${API_URL}`;

// Création de l'API slice avec RTK Query
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Vous pouvez ajouter des headers par défaut ici
      // Par exemple, pour l'authentification
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Meters", "User", "Clients", "Interventions"],
  endpoints: () => ({}),
});
