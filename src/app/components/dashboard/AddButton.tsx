import React from 'react';

interface AddButtonProps {
  onClick: () => void;
}

export default function AddButton({ onClick }: AddButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="bg-[#F8F8F8] hover:bg-gray-100 transition-colors p-4 rounded-xl flex items-center justify-center h-[90px] w-[90px]"
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" 
          fill="#222928" 
        />
      </svg>
    </button>
  );
}
