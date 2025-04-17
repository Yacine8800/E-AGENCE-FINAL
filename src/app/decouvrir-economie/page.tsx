"use client";

import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="pt-10">
      {/* Section 6 */}
      <section
        className="
        w-full md:w-[90%] 
 

        mx-auto 
        bg-white 
        rounded-[40px] 
        p-4 sm:p-8 md:p-12 
   
        backdrop-blur-sm 
        transition-all 
        duration-500 
        flex 
        flex-col 
        items-center 
        justify-between 
        relative 
        cursor-pointer 
        transform-gpu 
        min-h-[200px] 
        mb-20 sm:mb-32 md:mb-40
      "
      >
        <div className="container mx-auto max-w-5xl flex flex-col items-center">
          <h2
            className="
            font-montserrat 
            font-extrabold 
            text-3xl 
            sm:text-4xl 
            md:text-5xl 
            lg:text-6xl 
            leading-tight 
            mb-4 sm:mb-6 md:mb-8 
            text-black 
            text-center 
            max-w-3xl 
            mx-auto
          "
          >
            Réalisez des{" "}
            <span className="text-[#47B5B0] relative inline-block">
              économies
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5.5C47.3333 2.16667 146.667 2.16667 199 5.5"
                  stroke="#47B5B0"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="
            font-montserrat 
            font-medium 
            text-base 
            sm:text-lg 
            md:text-xl 
            lg:text-2xl 
            text-black 
            text-center 
            max-w-2xl 
            mx-auto
          "
          >
            Optez pour des produits d&apos;efficacité{" "}
            <span className="text-[#F8821C]">énergétique</span>
          </motion.p>
        </div>

        {/* Grid produits */}
        <div
          className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-4 
          gap-8 sm:gap-10 
          px-4 sm:px-8 md:px-12 lg:px-16 
          max-w-[1600px] 
          mx-auto 
          mt-10 sm:mt-12 md:mt-16 
          relative 
          before:absolute 
          before:inset-0 
          before:bg-white 
          before:scale-0 
          hover:before:scale-100 
          before:transition-transform 
          before:duration-300 
          before:origin-center 
          before:-z-10
        "
        >
          {/* Carte 1 */}
          <div className="bg-[#F9F9F9] hover:bg-white p-4 rounded-3xl space-y-4 hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-square relative flex items-center justify-center rounded-2xl p-4">
              <Image
                src="/economie/ampoule.png"
                alt="Ampoule"
                width={200}
                height={200}
                className="
                w-full 
                h-full 
                object-contain 
                transform 
                hover:scale-105 
                transition-transform 
                duration-500
              "
              />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">
              Éclairage Économique
            </h3>
            <p className="text-gray-600 text-sm">
              Privilégiez les LED et détecteurs de mouvement.
            </p>
          </div>

          {/* Carte 2 */}
          <div className="bg-[#F9F9F9] hover:bg-white p-4 rounded-3xl space-y-4 hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-square relative flex items-center justify-center rounded-2xl p-4">
              <Image
                src="/economie/ralonge.png"
                alt="Ralonge"
                width={200}
                height={200}
                className="
                w-full 
                h-full 
                object-contain 
                transform 
                hover:scale-105 
                transition-transform 
                duration-500
              "
              />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">
              Équipements Électriques
            </h3>
            <p className="text-gray-600 text-sm">
              Utilisez des multiprises et prises connectées.
            </p>
          </div>

          {/* Carte 3 */}
          <div className="bg-[#F9F9F9] hover:bg-white p-4 rounded-3xl space-y-4 hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-square relative flex items-center justify-center rounded-2xl p-4">
              <Image
                src="/economie/ventilo.png"
                alt="Ventilo"
                width={200}
                height={200}
                className="
                w-full 
                h-full 
                object-contain 
                transform 
                hover:scale-105 
                transition-transform 
                duration-500
              "
              />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">
              Chauffage & Climatisation
            </h3>
            <p className="text-gray-600 text-sm">
              Régulez avec un thermostat et des rideaux thermiques.
            </p>
          </div>

          {/* Carte 4 */}
          <div className="bg-[#F9F9F9] hover:bg-white p-4 rounded-3xl space-y-4 hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-square relative flex items-center justify-center rounded-2xl p-4">
              <Image
                src="/economie/frigo.png"
                alt="Frigo"
                width={200}
                height={200}
                className="
                w-full 
                h-full 
                object-contain 
                transform 
                hover:scale-105 
                transition-transform 
                duration-500
              "
              />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">
              Appareils Domestiques
            </h3>
            <p className="text-gray-600 text-sm">
              Choisissez des appareils basse consommation.
            </p>
          </div>
        </div>

        {/* Bouton en bas */}
        <div className="text-center mt-6 sm:mt-8 md:mt-10">
          <motion.a
            href="/solutions-eco"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
            inline-flex 
            items-center 
            gap-3 
            bg-white 
            text-[#47B5B0] 
            border-2 
            border-[#47B5B0] 
            px-6 sm:px-8 
            py-3 sm:py-4 
            rounded-2xl 
            font-medium 
            hover:bg-[#47B5B0] 
            hover:text-white 
            transition-all 
            duration-300 
            shadow-md 
            hover:shadow-lg
          "
          >
            <span className="text-base sm:text-lg">
              Consulter l&apos;eco-store
            </span>
            <svg
              width="25"
              height="26"
              viewBox="0 0 25 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.4974 6.75033H6.2474C5.69486 6.75033 5.16496 6.96982 4.77426 7.36052C4.38356 7.75122 4.16406 8.28113 4.16406 8.83366V19.2503C4.16406 19.8029 4.38356 20.3328 4.77426 20.7235C5.16496 21.1142 5.69486 21.3337 6.2474 21.3337H16.6641C17.2166 21.3337 17.7465 21.1142 18.1372 20.7235C18.5279 20.3328 18.7474 19.8029 18.7474 19.2503V13.0003M11.4557 14.042L20.8307 4.66699M20.8307 4.66699H15.6224M20.8307 4.66699V9.87533"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
        </div>
      </section>
    </div>
  );
}
