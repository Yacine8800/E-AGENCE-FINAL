import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../api/authApi";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Fonction pour récupérer l'utilisateur du localStorage
const getUserFromLocalStorage = (): User | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur du localStorage:", error);
        return null;
      }
    }
  }
  return null;
};

const initialState: AuthState = {
  user: getUserFromLocalStorage(),
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Stocker le token et les informations utilisateur dans localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Afficher les informations pour le débogage
        console.log("Informations utilisateur stockées dans localStorage:", user);
      }
    },

    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      // Supprimer le token et les informations utilisateur du localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setError } = authSlice.actions;
export default authSlice.reducer;
