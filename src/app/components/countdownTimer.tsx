"use client";

import { bebas_beue } from "@/utils/globalFunction";
import React, { useEffect, useState } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(120); // 3 minutes en secondes

  useEffect(() => {
    if (timeLeft <= 0) return; // Arrête le compteur si le temps est écoulé

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Nettoie l'intervalle pour éviter les fuites mémoire
  }, [timeLeft]);

  // Formatage en "M : SS" avec un espace autour du :
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} : ${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-[#BCBCBC]">
        Vous n’avez pas reçu de code ? <button
          className="text-primary font-bold"
          onClick={() => setTimeLeft(120)}
        > Renvoyer le code</button>
      </p>

      <p className={`${bebas_beue.className} text-[#D6D6D6] text-5xl pt-5`}>{formatTime(timeLeft)}</p>
    </div>
  );
};

export default CountdownTimer;
