import { API_KEY, API_URL } from "@/src/app/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types pour l'authentification
export interface User {
  _id: string;
  login: string;
  email?: string;
  contact?: string | null;
  firstname?: string;
  lastname?: string;
  authProvider?: string;
  isDocumentVerified?: boolean;
  isEmailVerified?: boolean;
  isContactVerified?: boolean;
  isCertified?: boolean;
  accountVerificationCompletion?: number;
  // Ajoutez d'autres champs selon la réponse de votre API
}

// Requête pour obtenir le token d'API
export interface GetTokenRequest {
  apikey: string;
}

export interface GetTokenResponse {
  message: string;
  data: string; // Le token JWT
}

// Requête d'authentification complète
export interface LoginRequest {
  login: string;
  passcode: string;
}

export interface LoginResponse {
  message: string;
  data?: {
    token: string;
    refreshToken: string;
    user: User;
  };
  success?: boolean;
}

// Requête de déconnexion
export interface LogoutRequest {
  token: string;
}

export interface LogoutResponse {
  success?: boolean;
  message?: string;
}

// Requête de rafraîchissement du token
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  message: string;
  data?: {
    token: string;
    refreshToken: string;
  };
  success?: boolean;
}

// Fonction pour vérifier si un token JWT est expiré
const isTokenExpired = (token: string): boolean => {
  try {
    // Décoder le token JWT pour obtenir la payload
    const base64Url = token.split(".")[1];
    if (!base64Url) return true;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));

    // Vérifier si le token a une date d'expiration
    if (!payload.exp) return false;

    // Comparer avec la date actuelle (en secondes)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'expiration du token:",
      error
    );
    // En cas d'erreur, considérer le token comme expiré par sécurité
    return true;
  }
};

// Fonction pour obtenir le token d'API
const getApiToken = async () => {
  try {
    // Vérifier si le token existe déjà dans le localStorage et s'il est encore valide
    const storedToken = localStorage.getItem("api_token");
    const tokenExpiry = localStorage.getItem("api_token_expiry");

    // Si le token existe et n'est pas expiré, l'utiliser
    if (storedToken && tokenExpiry && new Date(tokenExpiry) > new Date()) {
      return storedToken;
    }

    // Sinon, en demander un nouveau
    const response = await fetch(`${API_URL}/v3/user/get-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apikey: `${API_KEY}` }),
    });

    const data = await response.json();

    if (data.message === "ok" && data.data) {
      // Stocker le token dans le localStorage
      localStorage.setItem("api_token", data.data);

      // Calculer et stocker la date d'expiration (24h par défaut)
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      localStorage.setItem("api_token_expiry", expiry.toISOString());

      return data.data;
    }

    throw new Error("Impossible d'obtenir le token d'API");
  } catch (error) {
    console.error("Erreur lors de l'obtention du token d'API:", error);
    throw error;
  }
};

// Création de l'API slice pour l'authentification
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
    prepareHeaders: async (headers, { endpoint }) => {
      // Créer un nouvel objet Headers
      const myHeaders = new Headers();
      
      // Ajouter les en-têtes par défaut
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("X-Requested-With", "XMLHttpRequest");

      try {
        // Ne pas vérifier l'expiration pour les endpoints d'authentification
        const isAuthEndpoint =
          endpoint === "login" || endpoint === "refreshToken";

        // Pour l'endpoint de login, utiliser le token spécifique
        if (endpoint === "login") {
          myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiVHJRcEFiRzJ0Qnl4dzBlUyIsInJlZyI6IjIwMjUtMDQtMDlUMTI6MDE6MzAuOTA3WiIsImlhdCI6MTc0NDIwMDA5MCwiZXhwIjoxNzQ0MzcyODkwfQ.rm3crm_cjAzCWHTjpR50Um7i3vn9FIpXgOSWexFsf5k");
          
          // Copier les headers de myHeaders vers headers
          myHeaders.forEach((value, key) => {
            headers.set(key, value);
          });
          
          return headers;
        }

        // Pour les autres endpoints, continuer avec la logique existante
        const apiToken = await getApiToken();
        myHeaders.append("Authorization", `Bearer ${apiToken}`);

        // Si un token utilisateur existe et que ce n'est pas un endpoint d'authentification
        if (typeof window !== "undefined" && !isAuthEndpoint) {
          const userToken = localStorage.getItem("token");
          const refreshToken = localStorage.getItem("refreshToken");

          // Vérifier si le token existe
          if (userToken) {
            // Vérifier si le token est expiré
            if (isTokenExpired(userToken) && refreshToken) {
              try {
                // Appeler l'API pour rafraîchir le token
                const response = await fetch(
                  `${API_URL}/v3/user/client/refresh-token`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${apiToken}`,
                    },
                    body: JSON.stringify({ refreshToken }),
                  }
                );

                const data = await response.json();

                // Si le rafraîchissement a réussi, mettre à jour les tokens
                if (
                  data.message === "Action éffectuée avec succès" &&
                  data.data
                ) {
                  localStorage.setItem("token", data.data.token);
                  localStorage.setItem("refreshToken", data.data.refreshToken);

                  // Utiliser le nouveau token
                  myHeaders.set("Authorization", `Bearer ${data.data.token}`);
                } else {
                  // Si le rafraîchissement a échoué, supprimer les tokens et rediriger vers la page de connexion
                  localStorage.removeItem("token");
                  localStorage.removeItem("refreshToken");
                  localStorage.removeItem("currentLogin");

                  // Rediriger vers la page de connexion
                  if (typeof window !== "undefined") {
                    window.location.href = "/";
                  }
                }
              } catch (refreshError) {
                console.error(
                  "Erreur lors du rafraîchissement du token:",
                  refreshError
                );
                // En cas d'erreur, supprimer les tokens et rediriger vers la page de connexion
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("currentLogin");

                if (typeof window !== "undefined") {
                  window.location.href = "/";
                }
              }
            } else {
              // Si le token n'est pas expiré, l'utiliser
              myHeaders.set("Authorization", `Bearer ${userToken}`);
            }
          }
        }
        
        // Copier les headers de myHeaders vers headers
        myHeaders.forEach((value, key) => {
          headers.set(key, value);
        });
      } catch (error) {
        console.error("Erreur lors de la préparation des en-têtes:", error);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Authentification complète
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => {
        // Créer un nouvel objet Headers
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiVHJRcEFiRzJ0Qnl4dzBlUyIsInJlZyI6IjIwMjUtMDQtMDlUMTI6MDE6MzAuOTA3WiIsImlhdCI6MTc0NDIwMDA5MCwiZXhwIjoxNzQ0MzcyODkwfQ.rm3crm_cjAzCWHTjpR50Um7i3vn9FIpXgOSWexFsf5k");
        
        return {
          url: "/v3/user/client/login",
          method: "POST",
          headers: myHeaders,
          body: credentials,
        };
      },
    }),

    // Rafraîchissement du token
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (credentials) => ({
        url: "/v3/user/client/refresh-token",
        method: "POST",
        body: credentials,
      }),
    }),

    // Déconnexion
    logout: builder.mutation<LogoutResponse, void>({
      query: () => {
        // Récupérer le token utilisateur depuis le localStorage
        const userToken =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        return {
          url: "/v3/user/client/logout",
          method: "POST",
          body: { token: userToken },
        };
      },
    }),
  }),
});

// Export des hooks générés automatiquement
export const { useLoginMutation, useLogoutMutation, useRefreshTokenMutation } =
  authApi;
