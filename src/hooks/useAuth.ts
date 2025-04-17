"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearCredentials,
  setCredentials,
  setError,
  useLoginMutation,
  useLogoutMutation,
} from "../store";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  // État local pour stocker l'identifiant de connexion entre les étapes
  const [currentLogin, setCurrentLogin] = useState<string>("");

  // Initialiser avec la valeur du localStorage une fois que le composant est monté côté client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentLogin(localStorage.getItem("currentLogin") || "");
    }
  }, []);

  // Mutations pour l'authentification, le rafraîchissement du token et la déconnexion
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  // const [refreshToken, { isLoading: isRefreshLoading }] =
  //   useRefreshTokenMutation();

  // Utiliser la mutation de déconnexion
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

  // Fonction pour vérifier si un token JWT est expiré
  // const isTokenExpired = (token: string | null): boolean => {
  //   if (!token) return true;

  //   try {
  //     // Décoder le token JWT pour obtenir la payload
  //     const base64Url = token.split(".")[1];
  //     if (!base64Url) return true;

  //     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  //     const payload = JSON.parse(window.atob(base64));

  //     // Vérifier si le token a une date d'expiration
  //     if (!payload.exp) return false;

  //     // Comparer avec la date actuelle (en secondes)
  //     const currentTime = Math.floor(Date.now() / 1000);
  //     return payload.exp < currentTime;
  //   } catch (error) {
  //     console.error(
  //       "Erreur lors de la vérification de l'expiration du token:",
  //       error
  //     );
  //     // En cas d'erreur, considérer le token comme expiré par sécurité
  //     return true;
  //   }
  // };

  // Stocker l'identifiant pour la page de vérification
  const handleStoreLogin = (loginIdentifier: string) => {
    // Stocker dans l'état local et dans localStorage
    setCurrentLogin(loginIdentifier);
    if (typeof window !== "undefined") {
      localStorage.setItem("currentLogin", loginIdentifier);
    }
    return true;
  };

  // Fonction pour afficher un message toast
  const showToastMessage = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info"
  ) => {
    // Vérifier si la fonction toast existe dans l'environnement global
    if (typeof window !== "undefined" && (window as any).toast) {
      (window as any).toast[type](message);
    } else {
      // Fallback si toast n'est pas disponible
      // Utiliser l'API native si disponible
      if (typeof window !== "undefined" && "Notification" in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(message);
          }
        });
      }
    }
  };

  // Authentification complète avec l'identifiant et le code
  const handleLogin = async (passcode: string) => {
    if (!currentLogin) {
      dispatch(
        setError(
          "Aucun identifiant fourni. Veuillez recommencer le processus de connexion."
        )
      );
      showToastMessage(
        "Aucun identifiant fourni. Veuillez recommencer le processus de connexion.",
        "error"
      );
      return false;
    }

    try {
      const result = await login({
        login: currentLogin,
        passcode,
      }).unwrap();

      localStorage.setItem("token_login", result?.data?.token || "");

      // Vérifier si la réponse est un succès (message "Action éffectuée avec succès" et data présent)
      if (result.message === "Action éffectuée avec succès" && result.data) {
        // Stocker le token utilisateur et les informations utilisateur
        if (typeof window !== "undefined") {
          localStorage.setItem("token", result.data.token);
          // Stocker également le refreshToken si nécessaire
          localStorage.setItem("refreshToken", result.data.refreshToken);
          // Stocker les informations utilisateur
          localStorage.setItem("user", JSON.stringify(result.data.user));
        }

        // Mettre à jour le state Redux
        dispatch(
          setCredentials({
            user: result.data.user,
            token: result.data.token,
          })
        );

        // Afficher un message de succès
        showToastMessage(
          "Connexion réussie! Redirection vers le tableau de bord...",
          "success"
        );

        return true;
      } else if (result.message && !result.data) {
        // C'est probablement une erreur
        dispatch(setError(result.message));
        console.error("Erreur d'authentification:", result.message);
        showToastMessage(result.message, "error");
        return false;
      } else {
        // Cas par défaut pour les réponses inattendues
        const errorMsg = result.message || "Identifiants incorrects";
        dispatch(setError(errorMsg));
        console.error("Erreur d'authentification:", errorMsg);
        showToastMessage(errorMsg, "error");
        return false;
      }
    } catch (error: any) {
      // Afficher l'erreur complète avec tous ses détails
      console.error(
        "Erreur lors de la connexion:",
        JSON.stringify(error, null, 2)
      );

      // Essayer d'extraire le message d'erreur de différentes façons
      let errorMsg = "Erreur lors de la connexion";

      // Vérifier si l'erreur contient un message du backend
      if (error.data) {
        if (error.data.message) {
          errorMsg = error.data.message;
        } else if (typeof error.data === "string") {
          errorMsg = error.data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      } else if (typeof error === "string") {
        errorMsg = error;
      }

      dispatch(setError(errorMsg));
      showToastMessage(errorMsg, "error");
      return false;
    }
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      // Appeler l'API de déconnexion
      const result = await logout().unwrap();

      // Nettoyer les données locales quelle que soit la réponse de l'API
      dispatch(clearCredentials());
      setCurrentLogin("");

      // Supprimer les données du localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("currentLogin");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }

      // Message de déconnexion
      console.log("Vous avez été déconnecté.");

      // Rediriger vers la page d'accueil
      router.push("/");

      return true;
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);

      // Même en cas d'erreur, on nettoie les données locales
      dispatch(clearCredentials());
      setCurrentLogin("");

      if (typeof window !== "undefined") {
        localStorage.removeItem("currentLogin");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }

      router.push("/");
      return false;
    }
  };

  return {
    user,
    token,
    error,
    currentLogin,
    setCurrentLogin,
    isAuthenticated,
    isLoading: isLoading,
    isLoginLoading,
    isLogoutLoading,
    storeLogin: handleStoreLogin,
    login: handleLogin,
    logout: handleLogout,
  };
}
