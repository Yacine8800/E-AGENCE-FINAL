'use client';

import { useState, useEffect } from 'react';

interface RadioSelectProps {
  onChange?: (isForSelf: boolean) => void;
  initialValue?: boolean;
}

const RadioSelect: React.FC<RadioSelectProps> = ({ onChange, initialValue = true }) => {
  const [selected, setSelected] = useState<'moi' | 'tiers'>(initialValue ? 'moi' : 'tiers');

  useEffect(() => {
    // Mettre à jour la valeur lorsque initialValue change
    setSelected(initialValue ? 'moi' : 'tiers');
  }, [initialValue]);

  const handleChange = (value: 'moi' | 'tiers') => {
    setSelected(value);

    if (onChange) {
      onChange(value === 'moi');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <h3 className="text-sm font-medium text-gray-700 mb-2 md:mb-0 md:mr-4">
        Cette demande concerne :
      </h3>

      <div className="flex gap-6">
        {/* Option 1: Demande pour moi */}
        <label className={`
          flex items-center cursor-pointer gap-3 py-2 px-4 md:px-5 rounded-lg transition-all duration-200
          ${selected === 'moi'
            ? 'bg-red-50 text-red-600 border border-red-200'
            : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'}
        `}>
          <span className="relative flex items-center justify-center w-4 h-4">
            <span className={`
              absolute inset-0 rounded-full border transition-all duration-200
              ${selected === 'moi'
                ? 'border-red-500'
                : 'border-gray-400'}
            `}></span>
            {selected === 'moi' &&
              <span className="absolute inset-[3px] bg-red-500 rounded-full"></span>
            }
          </span>
          <input
            type="radio"
            name="demande"
            value="moi"
            checked={selected === 'moi'}
            onChange={() => handleChange('moi')}
            className="sr-only"
          />
          <span className="text-sm font-medium">Pour moi-même</span>
        </label>

        {/* Option 2: Demande pour tiers */}
        <label className={`
          flex items-center cursor-pointer gap-3 py-2 px-4 md:px-5 rounded-lg transition-all duration-200
          ${selected === 'tiers'
            ? 'bg-red-50 text-red-600 border border-red-200'
            : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'}
        `}>
          <span className="relative flex items-center justify-center w-4 h-4">
            <span className={`
              absolute inset-0 rounded-full border transition-all duration-200
              ${selected === 'tiers'
                ? 'border-red-500'
                : 'border-gray-400'}
            `}></span>
            {selected === 'tiers' &&
              <span className="absolute inset-[3px] bg-red-500 rounded-full"></span>
            }
          </span>
          <input
            type="radio"
            name="demande"
            value="tiers"
            checked={selected === 'tiers'}
            onChange={() => handleChange('tiers')}
            className="sr-only"
          />
          <span className="text-sm font-medium">Pour un tiers</span>
        </label>
      </div>
    </div>
  );
};

export default RadioSelect;
