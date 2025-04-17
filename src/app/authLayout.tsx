"use client";

import Link from "next/link";
import Image from "next/image";
import { useResponsive } from "../hooks/useResponsive";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isMobile } = useResponsive();

  return (
    <div className="flex flex-col min-h-screen">
      <Header isMobile={isMobile} />
      <main className="flex-grow flex justify-center items-center">
        {children}
      </main>
      <Footer isMobile={isMobile} />
    </div>
  );
}

interface LayoutProps {
  isMobile: boolean;
}

const Header = ({ isMobile }: LayoutProps) => {
  const svgSizeWidth = isMobile ?  300 : 476;
  const svgSizeHeight = isMobile ? 300 : 398;

  return (
    <header className="flex justify-start py-4 w-full px-5">
      <div className="flex items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={130} height={45} />
        </Link>
      </div>
      <div
        className={`${
          isMobile ? "absolute" : "fixed"
        } top-0 right-0 pointer-events-none`}
      >
        {" "}
        <svg
          width={svgSizeWidth}
          height={svgSizeHeight}
          viewBox={`${isMobile ? '0 0 200 500' : '0 0 476 398'}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_2765_4211"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="476"
            height="398"
          >
            <rect
              y="398"
              width="398"
              height="476"
              transform="rotate(-90 0 398)"
              fill="#D9D9D9"
            />
          </mask>
          <g mask="url(#mask0_2765_4211)">
            <g filter="url(#filter0_f_2765_4211)">
              <ellipse
                cx="201.701"
                cy="261.473"
                rx="201.701"
                ry="261.473"
                transform="matrix(0.606818 -0.79484 0.796671 0.604413 109 22.6387)"
                fill="#F8821C"
                fillOpacity="0.3"
              />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_f_2765_4211"
              x="-1.93994"
              y="-404.762"
              width="883.287"
              height="850.236"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_2765_4211"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </header>
  );
};

const Footer = ({ isMobile }: LayoutProps) => {
  return (
    <footer className="bottom-0 left-0 w-full py-4 px-10 pt-20 text-sm">
      <div className="flex items-center">
        <div className="flex items-center">
          <Image src="/logoCie 1.png" alt="Logo" width={30} height={30} />
          <span
            className={`ml-2 font-semibold text-sm ${
              isMobile ? "text-xs" : ""
            }`}
          >
            © Tous droits réservés
          </span>
        </div>
        <Link
          href="#"
          className={`hover:underline font-semibold text-sm pl-5 ${
            isMobile ? "text-xs" : ""
          }`}
        >
          Politique de confidentialité
        </Link>
        <Link
          href="#"
          className={`hover:underline font-semibold text-sm pl-5 ${
            isMobile ? "text-xs hover:underline" : ""
          }`}
        >
          Conditions générales d&apos;utilisation
        </Link>
      </div>
    </footer>
  );
};
