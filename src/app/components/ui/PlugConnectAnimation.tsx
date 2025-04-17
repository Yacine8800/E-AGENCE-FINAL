import React, { useEffect, useState } from "react";

interface PlugConnectAnimationProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
  isSuccess?: boolean; // Nouveau paramètre pour indiquer si l'opération est un succès ou un échec
}

export default function PlugConnectAnimation({
  isVisible,
  onAnimationComplete,
  isSuccess = true, // Par défaut, on considère que c'est un succès
}: PlugConnectAnimationProps) {
  const [animationStage, setAnimationStage] = useState(0);
  const [walkingStep, setWalkingStep] = useState(0); // État pour l'animation de marche

  useEffect(() => {
    if (!isVisible) {
      setAnimationStage(0);
      setWalkingStep(0);
      return;
    }

    // Animation de marche continue tout au long de l'animation
    const walkInterval = setInterval(() => {
      setWalkingStep((prev) => (prev + 1) % 4); // 4 étapes pour un cycle de marche complet
    }, 200); // Vitesse de la marche

    // Stage 1: Technicien s'approche du compteur
    const stage1 = setTimeout(() => setAnimationStage(1), 300);

    // Stage 2: Technicien commence à rattacher le compteur
    const stage2 = setTimeout(() => {
      setAnimationStage(2);
      // L'animation de marche continue, mais le technicien est maintenant stationnaire
    }, 1000);

    // Stage 3: Activation électrique du compteur ou problème
    const stage3 = setTimeout(() => setAnimationStage(3), 1600);

    // Stage 4: Résultat final (succès ou échec)
    const stage4 = setTimeout(() => setAnimationStage(4), 2200);

    // Animation complète avec fermeture automatique après un délai approprié
    const complete = setTimeout(() => {
      if (onAnimationComplete) onAnimationComplete();
    }, 3500);

    return () => {
      clearInterval(walkInterval);
      clearTimeout(stage1);
      clearTimeout(stage2);
      clearTimeout(stage3);
      clearTimeout(stage4);
      clearTimeout(complete);
    };
  }, [isVisible, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
      {/* Bouton de fermeture */}
      <button 
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-200 z-50"
        onClick={onAnimationComplete}
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="bg-white rounded-xl shadow-2xl p-8 w-96 h-96 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Fond avec effet de grille technique */}
        <div className="absolute inset-0 bg-gray-50">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="relative h-56 w-full z-10">
          {/* Compteur électrique moderne */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 h-32 w-28 bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg shadow-md flex flex-col items-center justify-center overflow-hidden">
            {/* Boîtier du compteur */}
            <div className="w-24 h-28 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg border border-gray-400 flex flex-col items-center justify-center relative p-2 shadow-inner">
              {/* Logo de la compagnie */}
              <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">E</span>
              </div>

              {/* Écran digital du compteur avec animation de scan */}
              <div 
                className="w-20 h-8 bg-black rounded-md mb-2 flex items-center justify-center shadow-inner overflow-hidden relative"
                style={{
                  boxShadow: animationStage >= 2 ? 
                    (isSuccess ? '0 0 2px rgba(0, 255, 0, 0.3)' : '0 0 2px rgba(255, 0, 0, 0.3)') : 'none'
                }}
              >
                {/* Animation de scan qui continue */}
                <div 
                  className="absolute w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent transition-all duration-200"
                  style={{
                    top: `${(walkingStep * 25) % 100}%`,
                    opacity: animationStage < 3 ? 0.7 : 0.3,
                    background: animationStage >= 3 && !isSuccess ? 
                      'linear-gradient(to right, transparent, rgba(255, 0, 0, 0.7), transparent)' : 
                      'linear-gradient(to right, transparent, rgba(0, 255, 0, 0.7), transparent)'
                  }}
                ></div>
                
                <div
                  className="text-sm font-mono font-bold tracking-wider transition-all duration-300 z-10"
                  style={{
                    color: animationStage >= 3 ? 
                      (isSuccess ? '#4AFF4A' : '#FF4A4A') : '#4AFF4A',
                    opacity: walkingStep % 2 === 0 ? 1 : 0.9,
                    textShadow: animationStage >= 3 ? 
                      (isSuccess ? '0 0 5px rgba(0, 255, 0, 0.7)' : '0 0 5px rgba(255, 0, 0, 0.7)') : 'none'
                  }}
                >
                  {animationStage < 2
                    ? [`----`, `----|`, `---|-`, `--|-|`, `-|-|-`, `|-|-|`][walkingStep % 6]
                    : animationStage < 3
                    ? [`88.88`, `88:88`][walkingStep % 2]
                    : isSuccess
                    ? [`00.00`, `00:00`][walkingStep % 2]
                    : [`Err`, `Err!`][walkingStep % 2]}
                </div>
              </div>

              {/* Boutons et indicateurs avec animation */}
              <div className="flex space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                  <div
                    className="w-2 h-2 rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: animationStage >= 3 && isSuccess
                        ? "#10B981"
                        : "#4B5563",
                      boxShadow: animationStage >= 3 && isSuccess && walkingStep % 2 === 0
                        ? "0 0 4px #10B981"
                        : "none",
                      transform: animationStage >= 3 && isSuccess && walkingStep % 2 === 0
                        ? "scale(1.1)"
                        : "scale(1)"
                    }}
                  ></div>
                </div>
                <div className="w-3 h-3 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                  <div
                    className="w-2 h-2 rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: animationStage >= 3 && !isSuccess
                        ? "#EF4444"
                        : "#4B5563",
                      boxShadow: animationStage >= 3 && !isSuccess && walkingStep % 2 === 0
                        ? "0 0 4px #EF4444"
                        : "none",
                      transform: animationStage >= 3 && !isSuccess && walkingStep % 2 === 0
                        ? "scale(1.1)"
                        : "scale(1)"
                    }}
                  ></div>
                </div>
              </div>

              {/* Plaque d'identification */}
              <div className="w-20 h-4 bg-gray-100 rounded-sm flex items-center justify-center border border-gray-300">
                <span className="text-gray-600 text-[8px]">
                  ID: EC-25478963
                </span>
              </div>

              {/* Câbles et connecteurs avec animation */}
              <div className="absolute -bottom-1 w-full h-4 flex justify-center space-x-2">
                <div 
                  className="w-1.5 h-4 bg-gradient-to-b from-red-600 to-red-800 rounded-t-sm shadow-sm transition-all duration-200"
                  style={{
                    opacity: animationStage >= 2 ? (walkingStep % 4 === 0 ? 1 : 0.8) : 1,
                    transform: animationStage >= 2 ? `translateY(${walkingStep % 4 === 0 ? '-1px' : '0px'})` : 'none'
                  }}
                ></div>
                <div 
                  className="w-1.5 h-4 bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-sm shadow-sm transition-all duration-200"
                  style={{
                    opacity: animationStage >= 2 ? (walkingStep % 4 === 1 ? 1 : 0.8) : 1,
                    transform: animationStage >= 2 ? `translateY(${walkingStep % 4 === 1 ? '-1px' : '0px'})` : 'none'
                  }}
                ></div>
                <div 
                  className="w-1.5 h-4 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-t-sm shadow-sm transition-all duration-200"
                  style={{
                    opacity: animationStage >= 2 ? (walkingStep % 4 === 2 ? 1 : 0.8) : 1,
                    transform: animationStage >= 2 ? `translateY(${walkingStep % 4 === 2 ? '-1px' : '0px'})` : 'none'
                  }}
                ></div>
                <div 
                  className="w-1.5 h-4 bg-gradient-to-b from-black to-gray-800 rounded-t-sm shadow-sm transition-all duration-200"
                  style={{
                    opacity: animationStage >= 2 ? (walkingStep % 4 === 3 ? 1 : 0.8) : 1,
                    transform: animationStage >= 2 ? `translateY(${walkingStep % 4 === 3 ? '-1px' : '0px'})` : 'none'
                  }}
                ></div>
              </div>

              {/* Emplacement pour branchement */}
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-10 bg-gray-800 rounded-l-md">
                <div className="w-1 h-1 rounded-full bg-gray-600 absolute top-2 left-0.5"></div>
                <div className="w-1 h-1 rounded-full bg-gray-600 absolute bottom-2 left-0.5"></div>
              </div>
            </div>
          </div>

          {/* Technicien (homme noir) avec animation de marche - positionné correctement */}
          <div
            className={`absolute right-6 top-1/3 -translate-y-1/2 h-40 w-32 transition-all duration-700 ease-in-out
              ${
                animationStage >= 1
                  ? "transform -translate-x-16"
                  : "transform translate-x-0"
              }`}
            style={{
              transform:
                animationStage < 2
                  ? `translateX(${
                      animationStage >= 1 ? "-64px" : "0px"
                    }) translateY(${walkingStep % 2 === 0 ? "-2px" : "0px"})`
                  : `translateX(${animationStage >= 1 ? "-64px" : "0px"})`,
              zIndex: 20 // S'assurer que le technicien est au-dessus des autres éléments
            }}
          >
            {/* Corps du technicien avec animation subtile */}
            <div 
              className="relative transition-all duration-200"
              style={{
                transform: walkingStep % 2 === 0 ? 'rotate(0.5deg)' : 'rotate(-0.5deg)'
              }}
            >
              {/* Tête plus réaliste */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#3A2618] flex items-center justify-center shadow-md overflow-hidden">
                {/* Visage plus réaliste */}
                <div className="flex flex-col items-center justify-center relative w-full h-full">
                  {/* Yeux plus réalistes */}
                  <div className="flex space-x-5 mt-1">
                    {/* Œil gauche avec sourcil */}
                    <div className="relative">
                      <div className="absolute -top-2 w-2.5 h-0.5 bg-black rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                      </div>
                    </div>
                    {/* Œil droit avec sourcil */}
                    <div className="relative">
                      <div className="absolute -top-2 w-2.5 h-0.5 bg-black rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Nez */}
                  <div className="w-1 h-2 bg-[#2A1A10] rounded-full mt-1"></div>
                  
                  {/* Bouche plus réaliste avec expression */}
                  <div
                    className="relative mt-1 w-4 h-1.5 bg-[#FFA07A] rounded-full overflow-hidden"
                    style={{
                      transform: animationStage >= 4 && !isSuccess ? 'rotate(180deg) translateY(1px)' : 'none',
                      backgroundColor: animationStage >= 4 && !isSuccess ? '#FF6A6A' : '#FFA07A',
                      height: animationStage >= 4 && isSuccess ? '2px' : '1.5px',
                      width: animationStage >= 4 ? (isSuccess ? '5px' : '3px') : '4px'
                    }}
                  >
                    {/* Dents visibles quand sourit */}
                    {animationStage >= 4 && isSuccess && (
                      <div className="absolute top-0 left-0.5 w-full h-0.5 bg-white"></div>
                    )}
                  </div>
                  
                  {/* Oreilles */}
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-3 bg-[#3A2618] rounded-full"></div>
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-3 bg-[#3A2618] rounded-full"></div>
                </div>
                
                {/* Casque de sécurité plus réaliste */}
                <div className="absolute -top-2 w-14 h-7 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-full shadow-md">
                  {/* Bande du casque */}
                  <div className="absolute bottom-0 w-full h-1 bg-yellow-700"></div>
                  {/* Logo sur le casque */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-[6px] font-bold">E</span>
                  </div>
                </div>
              </div>

              {/* Corps avec uniforme plus réaliste */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-14 h-16 bg-gradient-to-b from-blue-600 to-blue-800 rounded-md shadow-md overflow-hidden">
                {/* Détails de l'uniforme */}
                <div className="absolute inset-0 bg-blue-700 opacity-20">
                  {/* Texture de l'uniforme */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)',
                    backgroundSize: '4px 100%',
                    backgroundRepeat: 'repeat'
                  }}></div>
                </div>
                
                {/* Badge plus réaliste */}
                <div className="absolute top-2 right-1 w-4 h-3 bg-white rounded-sm flex items-center justify-center shadow-sm">
                  <div className="w-3 h-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-1 bg-blue-500 rounded-sm"></div>
                  </div>
                </div>
                
                {/* Poches avec ombres */}
                <div className="absolute bottom-2 left-2 w-4 h-3 bg-blue-900 rounded-sm shadow-inner">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-800"></div>
                </div>
                <div className="absolute bottom-2 right-2 w-4 h-3 bg-blue-900 rounded-sm shadow-inner">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-800"></div>
                </div>
                
                {/* Ceinture avec boucle */}
                <div className="absolute top-[60%] w-full h-2 bg-gradient-to-r from-black via-gray-800 to-black">
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 w-3 h-2 bg-gray-600 rounded-sm">
                    <div className="absolute inset-0.5 bg-gray-400 rounded-sm"></div>
                  </div>
                </div>
                
                {/* Col de l'uniforme */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-blue-500 rounded-t-sm"></div>
              </div>

              {/* Bras gauche qui tient un outil */}
              <div
                className={`absolute top-14 left-0 w-10 h-2.5 bg-[#3A2618] rounded-full transform ${
                  animationStage >= 2 ? "rotate-45" : "rotate-0"
                } transition-all duration-500 shadow-sm ${
                  animationStage >= 4 && !isSuccess ? "rotate-0" : ""
                }`}
              >
                {/* Main avec outil */}
                <div className="absolute -right-1 -top-1.5 w-4 h-4 rounded-full bg-[#3A2618]">
                  <div className="absolute top-0.5 right-0 w-8 h-1.5 bg-gradient-to-r from-gray-600 to-gray-400 rounded-r-md shadow-sm"></div>
                </div>
              </div>

              {/* Bras droit */}
              <div
                className={`absolute top-14 right-0 w-10 h-2.5 bg-[#3A2618] rounded-full transform ${
                  animationStage >= 2 ? "rotate-[-45deg]" : "rotate-0"
                } transition-all duration-500 shadow-sm ${
                  animationStage >= 4 && !isSuccess ? "rotate-0" : ""
                }`}
              >
                {/* Main */}
                <div className="absolute -left-1 -top-1.5 w-4 h-4 rounded-full bg-[#3A2618]"></div>
              </div>

              {/* Jambes avec animation de marche */}
              <div className="absolute top-28 left-1/2 -translate-x-1/2 flex space-x-2">
                {/* Jambe gauche avec animation */}
                <div
                  className="w-5 h-12 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-md shadow-md transition-all duration-200 origin-top"
                  style={{
                    transform:
                      animationStage < 2
                        ? walkingStep === 0
                          ? "translateY(-3px) rotate(-8deg)"
                          : walkingStep === 1
                          ? "translateY(-1px) rotate(-3deg)"
                          : walkingStep === 2
                          ? "translateY(0px) rotate(5deg)"
                          : "translateY(-1px) rotate(0deg)"
                        : // Animation subtile même quand le technicien est arrivé
                        walkingStep % 2 === 0
                        ? "translateY(-0.5px)"
                        : "translateY(0px)",
                  }}
                ></div>

                {/* Jambe droite avec animation */}
                <div
                  className="w-5 h-12 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-md shadow-md transition-all duration-200 origin-top"
                  style={{
                    transform:
                      animationStage < 2
                        ? walkingStep === 0
                          ? "translateY(0px) rotate(6deg)"
                          : walkingStep === 1
                          ? "translateY(-3px) rotate(0deg)"
                          : walkingStep === 2
                          ? "translateY(-3px) rotate(-8deg)"
                          : "translateY(-1px) rotate(-3deg)"
                        : // Animation subtile même quand le technicien est arrivé
                        walkingStep % 2 === 1
                        ? "translateY(-0.5px)"
                        : "translateY(0px)",
                  }}
                ></div>
              </div>

              {/* Chaussures avec animation */}
              <div className="absolute top-[156px] left-1/2 -translate-x-1/2 flex space-x-2">
                {/* Chaussure gauche */}
                <div
                  className="w-6 h-2.5 bg-black rounded-md shadow-md transition-all duration-200"
                  style={{
                    transform:
                      animationStage < 2
                        ? walkingStep === 0
                          ? "translateY(-3px) translateX(-2px) rotate(-8deg)"
                          : walkingStep === 1
                          ? "translateY(-1px) translateX(-1px) rotate(-3deg)"
                          : walkingStep === 2
                          ? "translateY(0px) translateX(1px) rotate(5deg)"
                          : "translateY(-1px) translateX(0px) rotate(0deg)"
                        : // Animation subtile même quand le technicien est arrivé
                        walkingStep % 2 === 0
                        ? "translateY(-0.5px) translateX(-0.5px)"
                        : "translateY(0px) translateX(0px)",
                  }}
                ></div>

                {/* Chaussure droite avec semelle visible */}
                <div className="relative">
                  {/* Semelle de la chaussure */}
                  <div
                    className="absolute bottom-0 w-6 h-1 bg-gray-600 rounded-md transition-all duration-200"
                    style={{
                      opacity: walkingStep === 2 ? 1 : 0,
                      transform:
                        walkingStep === 2
                          ? "translateY(0.5px) scaleX(0.9)"
                          : "translateY(0)",
                    }}
                  ></div>

                  {/* Chaussure principale */}
                  <div
                    className="w-6 h-2.5 bg-black rounded-md shadow-md transition-all duration-200"
                    style={{
                      transform:
                        animationStage < 2
                          ? walkingStep === 0
                            ? "translateY(0px) translateX(2px) rotate(6deg)"
                            : walkingStep === 1
                            ? "translateY(-3px) translateX(1px) rotate(0deg)"
                            : walkingStep === 2
                            ? "translateY(-3px) translateX(-1px) rotate(-8deg)"
                            : "translateY(-1px) translateX(-0.5px) rotate(-3deg)"
                          : // Animation subtile même quand le technicien est arrivé
                          walkingStep % 2 === 1
                          ? "translateY(-0.5px) translateX(-0.5px)"
                          : "translateY(0px) translateX(0px)",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Animation d'électricité ou d'erreur */}
          {animationStage >= 3 && (
            <div className="absolute left-[110px] top-1/2 -translate-y-1/2 w-40">
              {isSuccess ? (
                <div className="h-10 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-yellow-300/40 animate-ping absolute"></div>
                  <div className="w-full h-2 bg-gradient-to-r from-yellow-300 to-yellow-500 animate-pulse"></div>
                  <div
                    className="absolute top-0 left-1/4 w-1 h-10 bg-yellow-400 animate-pulse opacity-70"
                    style={{ transform: "rotate(30deg)" }}
                  ></div>
                  <div
                    className="absolute top-0 left-2/4 w-1 h-10 bg-yellow-400 animate-pulse opacity-70"
                    style={{ transform: "rotate(-20deg)" }}
                  ></div>
                </div>
              ) : (
                <div className="h-10 flex items-center justify-center">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping"></div>
                    <div className="absolute inset-2 bg-red-500/50 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="h-8 w-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Résultat final (succès ou échec) */}
          {animationStage >= 4 && (
            <div className="absolute inset-0 flex items-center justify-center">
              {isSuccess ? (
                <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center shadow-lg">
                  <svg
                    className="h-12 w-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : (
                <div className="bg-red-100 rounded-full h-20 w-20 flex items-center justify-center shadow-lg">
                  <svg
                    className="h-12 w-12 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center font-medium text-gray-800 z-30 px-4 relative bg-white/80 py-2 rounded-md shadow-sm">
          {animationStage < 2 && "Intervention technique en cours..."}
          {animationStage >= 2 &&
            animationStage < 3 &&
            "Analyse du compteur électrique..."}
          {animationStage >= 3 &&
            animationStage < 4 &&
            (isSuccess ? "Branchement en cours..." : "Problème détecté...")}
          {animationStage >= 4 &&
            (isSuccess
              ? "Rattachement validé ! ✓"
              : "Échec du rattachement ! ✗")}
        </div>

        {/* Barre de progression avec animation de pulsation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-gray-200 rounded-full overflow-hidden z-10 shadow-inner">
          {/* Effet de pulsation sur la barre */}
          <div 
            className="absolute inset-0 bg-white opacity-30 transition-all duration-200"
            style={{
              transform: `translateX(${walkingStep % 2 === 0 ? '-100%' : '-60%'})`,
              width: '40%'
            }}
          ></div>
          
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${(animationStage / 4) * 100}%`,
              backgroundColor: isSuccess
                ? (walkingStep % 2 === 0 ? '#10B981' : '#059669')
                : (walkingStep % 2 === 0 ? '#EF4444' : '#DC2626')
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
