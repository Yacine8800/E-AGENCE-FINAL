"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  function toggleDarkMode() {
    setIsDarkMode((prev) => !prev);
  }

  return (
    <footer
      className={`relative px-4 sm:px-8 md:px-[60px] lg:px-[80px] w-[90%] mx-auto rounded-[40px] py-12 transition-all duration-500 ${
        isDarkMode ? "bg-noir text-white" : "bg-gris text-black"
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full mx-auto py-8">
        {/* Section Logo et Mode Sombre */}
        <div className="flex flex-col items-center space-y-4">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Ma CIE en ligne"
              width={180}
              height={60}
              priority
            />
          </Link>
          {/* bouton de changement de thème  */}
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2  flex flex-col items-center">
              <div className="flex flex-col items-center mt-3">
                <div
                  onClick={toggleDarkMode}
                  className={`${
                    isDarkMode ? "bg-[#2C2C2C]" : "bg-[#D1CFCF]"
                  } rounded-[30px] h-[41px] w-[110px] flex items-center justify-between  px-3 relative cursor-pointer transition-colors duration-300 hover:shadow-md`}
                >
                  <motion.div
                    className={`absolute h-[32px] w-[32px] ${
                      isDarkMode ? "bg-[#F47D02]" : "bg-[#191818]"
                    } rounded-full z-10 shadow-md transition-colors duration-300`}
                    animate={{ x: isDarkMode ? 0 : 60 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 20,
                    }}
                  />
                  {/* Icônes fixes, toujours visibles et centrées */}
                  <div className="absolute inset-0 flex items-center justify-between px-[10px] z-20">
                    {/* Icône lune */}
                    <div className="flex items-center justify-center w-[32px] h-[32px] relative">
                      <svg
                        width="19"
                        height="20"
                        viewBox="0 0 19 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.63935 10.3242C1.93313 14.5703 5.49933 18.0249 9.76734 18.2146C12.7786 18.3465 15.4716 16.9284 17.0874 14.694C17.7566 13.7788 17.3975 13.1687 16.2795 13.3748C15.7328 13.4737 15.1697 13.515 14.5821 13.4902C10.5916 13.3253 7.32731 9.95317 7.31099 5.97088C7.30283 4.89904 7.52317 3.88492 7.92304 2.96149C8.36371 1.93912 7.83327 1.45267 6.81319 1.88965C3.58158 3.26655 1.37005 6.55627 1.63935 10.3242Z"
                          stroke={isDarkMode ? "white" : "#B1A8A8"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* Icône soleil */}
                    <div className="flex items-center justify-center w-[32px] h-[32px] relative -mr-1">
                      <svg
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.3059 15.3368C13.2664 15.3368 15.6664 12.9368 15.6664 9.97629C15.6664 7.01573 13.2664 4.61572 10.3059 4.61572C7.34532 4.61572 4.94531 7.01573 4.94531 9.97629C4.94531 12.9368 7.34532 15.3368 10.3059 15.3368Z"
                          stroke={isDarkMode ? "#B1A8A8" : "white"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.1979 15.8644L16.0907 15.7572M16.0907 4.19486L16.1979 4.08765L16.0907 4.19486ZM4.42115 15.8644L4.52836 15.7572L4.42115 15.8644ZM10.3095 1.79498V1.729V1.79498ZM10.3095 18.223V18.1571V18.223ZM2.12848 9.97602H2.0625H2.12848ZM18.5565 9.97602H18.4906H18.5565ZM4.52836 4.19486L4.42115 4.08765L4.52836 4.19486Z"
                          stroke={isDarkMode ? "#B1A8A8" : "white"}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section À propos */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-lg font-bold pb-3 mb-3 border-b-2 border-opacity-20 border-current inline-block">
            À propos
          </h3>
          <div
            className={`flex flex-col gap-4 ${
              isDarkMode ? "text-smallText" : ""
            }`}
          >
            <Link
              href={""}
              className="hover:underline transition-all duration-300 flex items-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 18L16 12L10 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Site institutionnel</span>
            </Link>
            <Link
              href={""}
              className="hover:underline transition-all duration-300 flex items-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 18L16 12L10 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Termes & conditions</span>
            </Link>
          </div>
        </div>

        {/* Section Partenaires */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-lg font-bold pb-3 mb-3 border-b-2 border-opacity-20 border-current inline-block">
            Partenaires
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full">
            <div
              className={`flex flex-col gap-3 ${
                isDarkMode ? "text-smallText" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-3 h-3 text-yellow-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 10V3L4 14H11V21L20 10H13Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>CME</p>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-3 h-3 text-yellow-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 10V3L4 14H11V21L20 10H13Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>SODECI</p>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-3 h-3 text-yellow-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 10V3L4 14H11V21L20 10H13Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>GS2E</p>
              </div>
            </div>
            <div
              className={`flex flex-col gap-3 ${
                isDarkMode ? "text-smallText" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-3 h-3 text-yellow-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 10V3L4 14H11V21L20 10H13Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>CIPREL</p>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-3 h-3 text-yellow-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 10V3L4 14H11V21L20 10H13Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>SMART ENERGY</p>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-3 h-3 text-yellow-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 10V3L4 14H11V21L20 10H13Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>ERANOVE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Téléchargement */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-lg font-bold pb-3 mb-3 border-b-2 border-opacity-20 border-current inline-block">
            Téléchargement
          </h3>
          <p className="mb-4 text-sm">
            Notre application mobile est disponible sur :
          </p>
          <div className="flex flex-col items-center sm:items-start gap-4">
            <div className="group transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <Image
                src="/storepng/appstore.png"
                alt="App Store"
                width={150}
                height={50}
                className="rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
              />
            </div>
            <div className="group transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <Image
                src="/storepng/googleplay.png"
                alt="Google Play"
                width={150}
                height={50}
                className="rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
              />
            </div>
            <div className="group transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <Image
                src="/storepng/appgallery.png"
                alt="AppGallery"
                width={150}
                height={50}
                className="rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Séparateur graphique */}
      <div className="my-8 w-full relative">
        <svg
          viewBox="0 0 1440 20"
          preserveAspectRatio="none"
          className="w-full h-[10px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke={isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)"}
            d="M580,15 C600,15 620,5 640,5 H800 C820,5 840,15 860,15"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* social links  */}
      <div className="py-6">
        <h2 className="mb-5 text-center font-semibold text-lg">
          Rejoignez-nous sur les réseaux :
        </h2>
        <div className="flex flex-row flex-wrap justify-center gap-8 md:gap-10 items-center">
          {/* Wrapper pour les icônes de réseaux sociaux avec animations */}
          <svg
            width="40"
            height="38"
            viewBox="0 0 40 38"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.8729 17.2928L32.8018 6H30.4498L21.8249 15.8034L14.9413 6H7L17.4116 20.8259L7 32.6667H9.352L18.4542 22.3117L25.7253 32.6667H33.6667M10.2009 7.73544H13.8142L30.448 31.0165H26.8338"
              fill={`${isDarkMode ? "white" : "#2A2A2A"}`}
            />
          </svg>
          <svg
            width="41"
            height="40"
            viewBox="0 0 41 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.8125 36.4802C30.9422 35.2735 37.1759 28.3552 37.1759 20.0002C37.1759 10.7952 29.6106 3.3335 20.2778 3.3335C10.9449 3.3335 3.37962 10.7952 3.37962 20.0002C3.37962 28.3552 9.61335 35.2752 17.7431 36.4802V25.0002H15.2083C14.5361 25.0002 13.8914 24.7368 13.416 24.2679C12.9407 23.7991 12.6736 23.1632 12.6736 22.5002C12.6736 21.8371 12.9407 21.2012 13.416 20.7324C13.8914 20.2636 14.5361 20.0002 15.2083 20.0002H17.7431V16.6668C17.7431 15.1197 18.3662 13.636 19.4753 12.542C20.5845 11.4481 22.0888 10.8335 23.6574 10.8335H24.5023C25.1746 10.8335 25.8193 11.0969 26.2946 11.5657C26.77 12.0346 27.037 12.6705 27.037 13.3335C27.037 13.9965 26.77 14.6324 26.2946 15.1013C25.8193 15.5701 25.1746 15.8335 24.5023 15.8335H23.6574C23.4333 15.8335 23.2184 15.9213 23.06 16.0776C22.9015 16.2339 22.8125 16.4458 22.8125 16.6668V20.0002H25.3472C26.0195 20.0002 26.6642 20.2636 27.1395 20.7324C27.6149 21.2012 27.8819 21.8371 27.8819 22.5002C27.8819 23.1632 27.6149 23.7991 27.1395 24.2679C26.6642 24.7368 26.0195 25.0002 25.3472 25.0002H22.8125V36.4802Z"
              fill={`${isDarkMode ? "white" : "#2A2A2A"}`}
            />
          </svg>
          <svg
            width="48"
            height="40"
            viewBox="0 0 48 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M23.8342 6.6665C25.4929 6.6665 27.1941 6.70317 28.843 6.76317L30.7907 6.84317L32.6549 6.93817L34.4008 7.03984L35.9954 7.1465C37.7262 7.25966 39.3549 7.89389 40.5948 8.93751C41.8347 9.98112 42.6062 11.3672 42.7734 12.8515L42.851 13.5598L42.9965 15.0765C43.1323 16.6482 43.2332 18.3615 43.2332 19.9998C43.2332 21.6382 43.1323 23.3515 42.9965 24.9232L42.851 26.4398L42.7734 27.1482C42.6061 28.6328 41.8344 30.019 40.5941 31.0627C39.3538 32.1063 37.7246 32.7404 35.9935 32.8532L34.4028 32.9582L32.6569 33.0615L30.7907 33.1565L28.843 33.2365C27.1744 33.2986 25.5044 33.3308 23.8342 33.3332C22.164 33.3308 20.4941 33.2986 18.8255 33.2365L16.8778 33.1565L15.0136 33.0615L13.2677 32.9582L11.6731 32.8532C9.94233 32.74 8.31357 32.1058 7.07368 31.0622C5.83379 30.0186 5.0623 28.6325 4.89509 27.1482L4.8175 26.4398L4.67201 24.9232C4.52425 23.285 4.44531 21.6429 4.43534 19.9998C4.43534 18.3615 4.53622 16.6482 4.67201 15.0765L4.8175 13.5598L4.89509 12.8515C5.06223 11.3674 5.83344 9.98159 7.07294 8.93801C8.31243 7.89444 9.94073 7.26003 11.6711 7.1465L13.2638 7.03984L15.0097 6.93817L16.8759 6.84317L18.8235 6.76317C20.4928 6.70105 22.1634 6.66882 23.8342 6.6665ZM19.9545 15.9582V24.0415C19.9545 24.8115 20.9244 25.2915 21.7004 24.9082L29.8479 20.8665C30.0252 20.7788 30.1725 20.6525 30.2749 20.5004C30.3773 20.3482 30.4312 20.1756 30.4312 19.9998C30.4312 19.8241 30.3773 19.6514 30.2749 19.4993C30.1725 19.3471 30.0252 19.2209 29.8479 19.1332L21.7004 15.0932C21.5234 15.0054 21.3226 14.9592 21.1182 14.9592C20.9138 14.9592 20.7131 15.0055 20.5361 15.0933C20.3591 15.1812 20.2122 15.3075 20.1101 15.4596C20.008 15.6117 19.9543 15.7842 19.9545 15.9598V15.9582Z"
              fill={`${isDarkMode ? "white" : "#2A2A2A"}`}
            />
          </svg>
          <svg
            width="35"
            height="34"
            viewBox="0 0 35 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.0509 0.333008C20.9827 0.338008 21.9632 0.348008 22.8098 0.371341L23.1429 0.383008C23.5276 0.396341 23.9071 0.413008 24.3655 0.433008C26.1926 0.516341 27.4393 0.796341 28.5331 1.20801C29.6664 1.63134 30.6212 2.20467 31.5759 3.12967C32.4495 3.96256 33.1251 4.97046 33.5558 6.08301C33.98 7.14467 34.2685 8.35467 34.3543 10.1297C34.3749 10.573 34.3921 10.9413 34.4058 11.3163L34.4161 11.6397C34.4419 12.4597 34.4522 13.4113 34.4556 15.2863L34.4574 16.5297V18.713C34.4615 19.9287 34.4484 21.1444 34.4179 22.3597L34.4076 22.683C34.3938 23.058 34.3767 23.4263 34.356 23.8697C34.2702 25.6447 33.9783 26.853 33.5558 27.9163C33.1251 29.0289 32.4495 30.0368 31.5759 30.8697C30.7178 31.7175 29.6794 32.3733 28.5331 32.7913C27.4393 33.203 26.1926 33.483 24.3655 33.5663L23.1429 33.6163L22.8098 33.6263C21.9632 33.6497 20.9827 33.6613 19.0509 33.6647L17.7699 33.6663H15.5221C14.269 33.6706 13.0159 33.6578 11.7632 33.628L11.4301 33.618C11.0224 33.603 10.6149 33.5858 10.2075 33.5663C8.38039 33.483 7.13372 33.203 6.03816 32.7913C4.89252 32.3731 3.85468 31.7173 2.99705 30.8697C2.12292 30.0369 1.44663 29.029 1.01544 27.9163C0.591296 26.8547 0.302811 25.6447 0.216952 23.8697L0.165437 22.683L0.156852 22.3597C0.125197 21.1444 0.110886 19.9287 0.113922 18.713V15.2863C0.109169 14.0707 0.121763 12.855 0.1517 11.6397L0.16372 11.3163C0.177458 10.9413 0.194629 10.573 0.215235 10.1297C0.301094 8.35467 0.589579 7.14634 1.01372 6.08301C1.44592 4.97 2.1234 3.96207 2.99877 3.12967C3.8559 2.28226 4.89313 1.62646 6.03816 1.20801C7.13372 0.796341 8.37867 0.516341 10.2075 0.433008C10.6642 0.413008 11.0454 0.396341 11.4301 0.383008L11.7632 0.373008C13.0154 0.343396 14.2679 0.330617 15.5204 0.334674L19.0509 0.333008ZM17.2856 8.66634C15.0085 8.66634 12.8247 9.54431 11.2145 11.1071C9.60436 12.6699 8.69978 14.7895 8.69978 16.9997C8.69978 19.2098 9.60436 21.3294 11.2145 22.8922C12.8247 24.455 15.0085 25.333 17.2856 25.333C19.5628 25.333 21.7466 24.455 23.3568 22.8922C24.9669 21.3294 25.8715 19.2098 25.8715 16.9997C25.8715 14.7895 24.9669 12.6699 23.3568 11.1071C21.7466 9.54431 19.5628 8.66634 17.2856 8.66634ZM17.2856 11.9997C17.9621 11.9996 18.6321 12.1288 19.2571 12.38C19.8822 12.6311 20.4501 12.9993 20.9286 13.4636C21.407 13.9278 21.7866 14.4789 22.0455 15.0855C22.3045 15.6921 22.4379 16.3422 22.438 16.9988C22.4381 17.6554 22.305 18.3057 22.0462 18.9123C21.7874 19.519 21.4081 20.0702 20.9298 20.5346C20.4515 20.999 19.8837 21.3674 19.2587 21.6188C18.6337 21.8701 17.9639 21.9996 17.2874 21.9997C15.9211 21.9997 14.6108 21.4729 13.6447 20.5352C12.6786 19.5975 12.1358 18.3258 12.1358 16.9997C12.1358 15.6736 12.6786 14.4018 13.6447 13.4641C14.6108 12.5265 15.9211 11.9997 17.2874 11.9997M26.3025 6.16634C25.7332 6.16634 25.1873 6.38583 24.7847 6.77653C24.3822 7.16724 24.156 7.69714 24.156 8.24967C24.156 8.80221 24.3822 9.33211 24.7847 9.72281C25.1873 10.1135 25.7332 10.333 26.3025 10.333C26.8718 10.333 27.4177 10.1135 27.8203 9.72281C28.2228 9.33211 28.449 8.80221 28.449 8.24967C28.449 7.69714 28.2228 7.16724 27.8203 6.77653C27.4177 6.38583 26.8718 6.16634 26.3025 6.16634Z"
              fill={`${isDarkMode ? "white" : "#2A2A2A"}`}
            />
          </svg>
          <svg
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.4581 0C7.62133 0 0.45813 6.56753 0.45813 14.6695C0.45813 17.442 1.29813 20.0385 2.75893 22.2507L1.33173 26.6985C1.24979 26.9538 1.24439 27.2247 1.31612 27.4827C1.38785 27.7406 1.53405 27.9761 1.73935 28.1643C1.94464 28.3525 2.20146 28.4866 2.4828 28.5523C2.76413 28.6181 3.0596 28.6131 3.33813 28.538L8.18933 27.2295C10.6833 28.6127 13.5433 29.3424 16.4581 29.339C25.2949 29.339 32.4581 22.7714 32.4581 14.6695C32.4581 6.56753 25.2949 0 16.4581 0ZM12.8389 17.9892C16.0757 20.9554 19.1653 21.347 20.2565 21.3837C21.9157 21.4394 23.5317 20.2776 24.1605 18.9295C24.2392 18.7617 24.2677 18.5776 24.2429 18.3963C24.2182 18.215 24.1411 18.0431 24.0197 17.8982C23.1429 16.8714 21.9573 16.1335 20.7989 15.4C20.5572 15.2463 20.2599 15.1846 19.9695 15.2278C19.6792 15.2711 19.4184 15.4159 19.2421 15.6318L18.2821 16.9741C18.2314 17.0459 18.1528 17.0975 18.0621 17.1182C17.9715 17.1389 17.8757 17.1272 17.7941 17.0855C17.1429 16.7437 16.1941 16.1628 15.5125 15.5379C14.8309 14.913 14.2357 14.0827 13.9013 13.5238C13.8609 13.4526 13.8494 13.3705 13.8691 13.2922C13.8887 13.214 13.9382 13.1447 14.0085 13.0969L15.4869 12.0906C15.6985 11.9228 15.8351 11.6892 15.8706 11.4348C15.906 11.1803 15.8378 10.9228 15.6789 10.7117C14.9621 9.74934 14.1269 8.5259 12.9157 7.71468C12.7591 7.61149 12.576 7.54714 12.3843 7.52787C12.1926 7.50859 11.9986 7.53504 11.8213 7.60466C10.3493 8.18264 9.07573 9.66425 9.13653 11.1884C9.17653 12.1889 9.60373 15.0215 12.8389 17.9892Z"
              fill={`${isDarkMode ? "white" : "#2A2A2A"}`}
            />
          </svg>
        </div>
        {isDarkMode ? (
          <div className="mt-10 w-full mx-5 border border-white"></div>
        ) : (
          <div className="mt-10 w-full mx-5 border border-transparent"></div>
        )}

        {/* Copyright amélioré */}
        <div
          className={`pt-6 pb-4 text-center ${
            isDarkMode ? "border-t border-gray-800" : "border-t border-gray-300"
          }`}
        >
          <p className="text-sm">
            © {new Date().getFullYear()} Ma CIE en ligne. Tous droits réservés.
          </p>
          <p className="mt-2 text-xs opacity-70">
            Conçu et développé avec passion, pour un avenir énergétique durable.
          </p>
        </div>
      </div>

      {/* svg de fin de page  */}
      <div className="absolute bottom-0 left-0 right-0 rounded-[20px]">
        {isDarkMode ? (
          <svg
            viewBox="0 0 1625 293"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <mask
              id="mask0_4_7877"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1625"
              height="306"
            >
              <rect width="1625" height="306" rx="30" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_4_7877)">
              <g filter="url(#filter0_i_4_7877)">
                <path
                  d="M1755.21 68.0328C1777.49 370.599 1959.78 384.01 626.236 370.6C204.148 304.85 -3.07814 363.965 4.16259 315.382C9.38573 280.337 391.148 140.312 872.121 172.522C1353.09 204.731 1752.65 33.3452 1755.21 68.0328Z"
                  fill="#EB7F00"
                />
              </g>
              <g filter="url(#filter1_d_4_7877)">
                <path
                  d="M2098.42 -55.0329C2092.83 -5.01171 1446.6 289.932 950.894 186.923C480.258 101.428 5.52797 352.943 5.52797 352.943C-58.7062 353.684 387.363 40.8452 1113.95 71.7681C1840.53 102.691 2104.01 -105.054 2098.42 -55.0329Z"
                  fill="url(#paint0_linear_4_7877)"
                  shapeRendering="crispEdges"
                />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_i_4_7877"
                x="3.98047"
                y="63.3721"
                width="1775.77"
                height="338.97"
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
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="4" dy="37" />
                <feGaussianBlur stdDeviation="14.2" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_4_7877"
                />
              </filter>
              <filter
                id="filter1_d_4_7877"
                x="-37.0938"
                y="-77.3457"
                width="2172.1"
                height="488.79"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="22" />
                <feGaussianBlur stdDeviation="18.25" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_4_7877"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_4_7877"
                  result="shape"
                />
              </filter>
              <linearGradient
                id="paint0_linear_4_7877"
                x1="1192.99"
                y1="181.198"
                x2="1180.79"
                y2="14.7439"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#EBEBEB" stopOpacity="0" />
                <stop offset="1" stopColor="#F7F7F7" stopOpacity="0.24" />
              </linearGradient>
            </defs>
          </svg>
        ) : (
          <svg
            viewBox="0 0 1625 293"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <mask
              id="mask0_4_7776"
              // style="mask-type:alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1625"
              height="306"
            >
              <rect width="1625" height="306" rx="30" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_4_7776)">
              <g filter="url(#filter0_i_4_7776)">
                <path
                  d="M1755.21 68.0328C1777.49 370.599 1959.78 384.01 626.236 370.6C204.148 304.85 -3.07814 363.965 4.16259 315.382C9.38573 280.337 391.148 140.312 872.121 172.522C1353.09 204.731 1752.65 33.3452 1755.21 68.0328Z"
                  fill="#FCFCFC"
                  fillOpacity="0.28"
                />
              </g>
              <g filter="url(#filter1_d_4_7776)">
                <path
                  d="M2098.42 -55.0329C2092.83 -5.01171 1446.6 289.932 950.894 186.923C480.258 101.428 5.52797 352.943 5.52797 352.943C-58.7062 353.684 387.363 40.8452 1113.95 71.7681C1840.53 102.691 2104.01 -105.054 2098.42 -55.0329Z"
                  fill="url(#paint0_linear_4_7776)"
                  shapeRendering="crispEdges"
                />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_i_4_7776"
                x="3.98047"
                y="63.3721"
                width="1775.77"
                height="338.97"
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
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="4" dy="37" />
                <feGaussianBlur stdDeviation="14.2" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_4_7776"
                />
              </filter>
              <filter
                id="filter1_d_4_7776"
                x="-37.0938"
                y="-77.3457"
                width="2172.1"
                height="488.79"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="22" />
                <feGaussianBlur stdDeviation="18.25" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_4_7776"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_4_7776"
                  result="shape"
                />
              </filter>
              <linearGradient
                id="paint0_linear_4_7776"
                x1="1192.99"
                y1="181.198"
                x2="1180.79"
                y2="14.7439"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#EBEBEB" stopOpacity="0" />
                <stop offset="1" stopColor="#F7F7F7" stopOpacity="0.24" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>
    </footer>
  );
};

export default Footer;
