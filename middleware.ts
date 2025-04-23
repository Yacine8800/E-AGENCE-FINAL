import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Définir les pages qui nécessitent une authentification
const protectedRoutes = [
  "/dashboard",
  "/mes-demandes",
  "/reclamation",
  "/secretQuestion",
  "/incident",
  "/depannage",
  "/formation",
  "/audit-eco",
  "/audit-conso",
  "/chat",
];

// Définir les pages accessibles uniquement aux visiteurs non authentifiés
const authRoutes = [
  "/login",
  "/register-stepper",
  "/verify",
  "/recuperation",
  "/defineCode",
  "/code",
  "/OTP",
  "/recupOTP",
  "/recupQuestion",
];

export function middleware(request: NextRequest) {
  // Obtenir le token depuis les cookies
  const token =
    request.cookies.get("token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.has("__Secure-next-auth.session-token")
      ? request.cookies.get("__Secure-next-auth.session-token")?.value
      : null;

  // Vérification alternative si le token n'est pas dans les cookies
  // mais dans le localStorage (accessible via la requête)
  const hasLocalStorageToken = request.headers.get("x-has-token") === "true";

  // On considère l'utilisateur authentifié s'il a un token dans les cookies
  // ou si le header indique qu'il a un token dans le localStorage
  const isAuthenticated = !!token || hasLocalStorageToken;

  // Obtenir le chemin demandé
  const { pathname } = request.nextUrl;

  // 1. Si l'utilisateur tente d'accéder à une route protégée sans être authentifié
  if (
    !isAuthenticated &&
    protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    // Rediriger vers la page de connexion
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // 2. Si l'utilisateur est authentifié et tente d'accéder à une route d'authentification
  if (
    isAuthenticated &&
    authRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    // Rediriger vers le tableau de bord
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  // Sinon, continuer normalement
  return NextResponse.next();
}

// Configurer le middleware pour n'être exécuté que sur certains chemins
export const config = {
  matcher: [
    /*
     * Match toutes les request paths sauf:
     * 1. celles qui commencent par:
     *    - api (API routes)
     *    - _next/static (static files)
     *    - _next/image (image optimization files)
     *    - favicon.ico (favicon file)
     * 2. celles qui se terminent par:
     *    - .jpg, .jpeg, .gif, .png, .svg, .ico (images)
     *    - .css, .js (static files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
