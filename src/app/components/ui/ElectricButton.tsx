import React, { useState } from 'react';

interface ElectricButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export default function ElectricButton({
  onClick,
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  disabled = false
}: ElectricButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    onClick && onClick();
  };

  const variantClasses = {
    primary: 'bg-primary text-white border-transparent hover:bg-primary-dark',
    secondary: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden transition-all duration-300 ease-out 
        rounded-md shadow-sm px-4 py-2 text-sm font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        ${variantClasses[variant]}
        ${isAnimating ? 'transform scale-[0.98]' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isAnimating && (
        <>
          <span className="absolute inset-0 h-full w-full bg-white/20 animate-electric-pulse-1"></span>
          <span className="absolute inset-0 h-full w-full bg-white/10 animate-electric-pulse-2"></span>
        </>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
