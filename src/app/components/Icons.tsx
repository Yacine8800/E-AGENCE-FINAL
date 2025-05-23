import Image from "next/image";

interface IconProps {
  className?: string;
}

export const AssistanceIcon = ({ className = "" }: IconProps) => (
  <Image
    src="/icons/mingcute--service-fill.svg"
    alt="Assistance"
    width={24}
    height={24}
    className={className}
  />
);

export const SimulateurIcon = ({ className = "" }: IconProps) => (
  <Image
    src="/icons/ion--calculator-outline.svg"
    alt="Simulateur"
    width={24}
    height={24}
    className={className}
  />
);

export const InfoIcon = ({ className = "" }: IconProps) => (
  <Image
    src="/icons/info.svg"
    alt="Information"
    width={24}
    height={24}
    className={className}
  />
);
