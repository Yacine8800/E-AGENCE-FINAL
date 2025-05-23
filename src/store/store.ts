import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// Import API slices
import { apiSlice } from "./api/apiSlice";
import { authApi } from "./api/authApi";

// Import feature slices
import { referenceDataApi } from "../services/referencedata";
import { reclamationApi } from "../services/sara/reclamation";
import authReducer from "./slices/authSlice";
import postpayeReducer from "./slices/postpayeSlice";

export const store = configureStore({
  reducer: {
    // API reducers
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [referenceDataApi.reducerPath]: referenceDataApi.reducer,
    [reclamationApi.reducerPath]: reclamationApi.reducer,
    // Pas besoin d'ajouter postpayeApi.reducer car il est injecté dans apiSlice

    // Feature reducers
    auth: authReducer,
    postpaye: postpayeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      apiSlice.middleware,
      authApi.middleware,
      referenceDataApi.middleware,
      reclamationApi.middleware
    ),
  devTools: process.env.NODE_ENV !== "production",
});

// Setup listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
