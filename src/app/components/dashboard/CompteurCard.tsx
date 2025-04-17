import React from 'react';

interface CompteurCardProps {
  label: string;
  type: 'prepaye' | 'postpaye';
  isActive?: boolean;
}

export default function CompteurCard({ label, type, isActive = false }: CompteurCardProps) {
  const bgColor = type === 'prepaye' ? 'bg-[#F4F9F8]' : 'bg-[#FDF8F4]';
  const iconColor = type === 'prepaye' ? '#1F7A70' : '#EE761A';
  
  return (
    <div className={`${bgColor} p-4 rounded-xl flex flex-col items-center justify-center h-[90px] w-[90px] relative`}>
      {isActive && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
        </div>
      )}
      <div className="mb-2">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" 
            fill={iconColor} 
          />
        </svg>
      </div>
      <p className="text-xs text-center font-medium">{label}</p>
    </div>
  );
}
