import { useResponsive } from "@/src/hooks/useResponsive";
import { bebas_beue } from "@/utils/globalFunction";
import React from "react";

interface TitleProps {
  title: string;
}


export default function Title({ title }: TitleProps) {
  const { isMobile } = useResponsive();

  return (
    <div>
      <h2
        className={`text-center font-semibold ${bebas_beue.className} ${isMobile ? 'text-[50px]' : 'text-[55px] '}`}
      >
        {title}
      </h2>
    </div>
  );
}
