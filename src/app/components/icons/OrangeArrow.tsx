// OrangeArrow.tsx
import { ComponentProps } from "react";

interface OrangeArrowProps {
  className?: string;
}

export default function OrangeArrow({ className = "" }: OrangeArrowProps) {
  // La flèche est invisible par défaut
  // Elle devient visible si active (via className) ou au survol (via group-hover)
  return (
    <svg
      width="9"
      height="12"
      viewBox="0 0 9 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`mr-2 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 ${className}`}
    >
      <path
        d="M0 2.23703C0 0.639643 1.78029 -0.313139 3.1094 0.572934L8.1094 3.90627C8.6658 4.2772 9 4.90166 9 5.57037V6.42963C9 7.09834 8.6658 7.7228 8.1094 8.09373L3.1094 11.4271C1.78029 12.3131 0 11.3604 0 9.76297V2.23703Z"
        fill="#F7942E"
      />
    </svg>
  );
}
