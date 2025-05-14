"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface NavMenuProps {
  menuItems: string[];
}

export default function NavMenu({ menuItems }: NavMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string>(
    menuItems[0] || "Nos compteurs"
  );

  const handleMenuClick = (item: string) => {
    setActiveMenu(item);
    // Émettre un événement personnalisé pour informer le carrousel du changement de menu
    const event = new CustomEvent("menu-changed", {
      detail: { menu: item },
    });
    document.dispatchEvent(event);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full lg:w-72 flex-shrink-0"
    >
      <nav className="space-y-1" aria-label="Menu">
        {menuItems.map((item) => (
          <motion.button
            key={item}
            onClick={() => handleMenuClick(item)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center w-full text-left p-3 border-l-4 transition-all duration-300 ${
              activeMenu === item
                ? "border-l-orange bg-white shadow-sm font-medium text-gray-900"
                : "border-l-transparent hover:bg-white/70 text-gray-700"
            }`}
            aria-pressed={activeMenu === item}
            aria-label={item}
            tabIndex={0}
          >
            {activeMenu === item ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mr-2 text-orange"
              >
                ▶
              </motion.span>
            ) : (
              <span className="mr-2 opacity-0">▶</span>
            )}
            <span className="text-base sm:text-lg">{item}</span>
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
}
