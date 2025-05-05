import React from "react";

interface LoaderProps {
  context: string;
}

export default function Loader({ context }: LoaderProps) {
  // Déterminer le texte à afficher en fonction du contexte
  const getContextText = () => {
    switch (context) {
      case "logout":
        return "Déconnexion";
      case "login":
        return "Connexion";
      default:
        return "Chargement";
    }
  };

  return (
    <>
      {/* Styles pour les animations personnalisées */}
      <style jsx>{`
        @keyframes progressBar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes moveLeftRight {
          0% {
            transform: translateX(-100px);
          }
          50% {
            transform: translateX(100px);
          }
          100% {
            transform: translateX(-100px);
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-progressBar {
          animation: progressBar 1.5s cubic-bezier(0.45, 0, 0.55, 1) forwards;
        }

        .animate-moveLeftRight {
          animation: moveLeftRight 3s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 1s ease-in-out infinite;
        }
      `}</style>
      {/* Premier div pour le fond opaque */}
      <div className="fixed inset-0 bg-white z-[9999999]"></div>
      {/* Deuxième div pour le contenu du loader */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-[99999999]">
        {/* Container principal */}
        <div className="relative w-full max-w-md px-6 py-10">
          {/* Animations d'électricité moderne */}
          <div className="relative h-40 flex items-center justify-center mb-8">
            {/* Cercle central avec éclair */}
            <div className="relative z-10 rounded-full p-4 shadow-[0_0_30px_rgba(236,79,72,0.3)]">
              <div className="bg-gradient-to-br from-vert to-green-500 rounded-full p-5">
                <svg
                  className="w-10 h-10 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 2L4.5 12.5H11L9 22L17.5 11.5H11L13 2Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
            </div>

            {/* Points d'énergie qui se déplacent le long des lignes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-vert absolute animate-moveLeftRight"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center transform rotate-45">
              <div
                className="w-2 h-2 rounded-full bg-[#FFBE20] absolute animate-moveLeftRight"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center transform rotate-90">
              <div
                className="w-2 h-2 rounded-full bg-vert absolute animate-moveLeftRight"
                style={{ animationDelay: "0.8s" }}
              ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center transform rotate-135">
              <div
                className="w-2 h-2 rounded-full bg-[#FFBE20] absolute animate-moveLeftRight"
                style={{ animationDelay: "1.2s" }}
              ></div>
            </div>
          </div>

          {/* Texte moderne */}
          <div className="text-center">
            <h3 className="text-[#1F2937] text-xl font-bold mb-2">
              {getContextText()}
              <span className="inline-block w-1 h-1 bg-vert rounded-full ml-1 animate-blink"></span>
              <span
                className="inline-block w-1 h-1 bg-vert rounded-full ml-1 animate-blink"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="inline-block w-1 h-1 bg-vert rounded-full ml-1 animate-blink"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}
