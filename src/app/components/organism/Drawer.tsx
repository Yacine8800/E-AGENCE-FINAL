import React from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string; // ex: "w-[600px]"
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  width = "w-[600px]",
  children,
  title,
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div
        className={`relative ${width} bg-white h-full shadow-2xl overflow-auto flex flex-col rounded-l-3xl transform transition-all duration-500 animate-slideInRight`}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#FFFFFF] shadow-sm">
            {title && (
              <h2 className="text-2xl font-semibold text-center flex-1 text-gray-800">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-200"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-500"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-auto p-6 bg-white relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
