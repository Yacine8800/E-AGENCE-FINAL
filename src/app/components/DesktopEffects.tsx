"use client";

import { useEffect, useState } from "react";
import EnergyScrollbar from "./EnergyScrollbar";
import ElectricityEffect from "./ElectricityEffect";
import ElectricityCursor from "./ElectricityCursor";

const DesktopEffects = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Detect if we're on desktop
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    checkDesktop();
    setIsInitialized(true);

    // Add resize listener
    window.addEventListener("resize", checkDesktop);

    return () => {
      window.removeEventListener("resize", checkDesktop);
    };
  }, []);

  // Only render after client-side hydration and only on desktop
  if (!isInitialized || !isDesktop) return null;

  return (
    <>
      <EnergyScrollbar />
      {/* <ElectricityEffect /> */}
      {/* <ElectricityCursor /> */}
    </>
  );
};

export default DesktopEffects;
