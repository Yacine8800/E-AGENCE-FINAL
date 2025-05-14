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
    <div className="flex justify-between items-center space-x-4">
      {/* Option 1: Demande pour moi */}
      <label className="flex items-center cursor-pointer space-x-2">
        <span
          className={`w-5 h-5 rounded-full border-2 border-none flex bg-white items-center justify-center ${selected === 'moi' ? 'border-red-500' : ''
            }`}
        >
          {selected === 'moi' && <span className="w-5 h-5 bg-red-500 rounded-full"></span>}
        </span>
        <input
          type="radio"
          name="demande"
          value="moi"
          checked={selected === 'moi'}
          onChange={() => handleChange('moi')}
          className="hidden"
        />
        <span className="text-sm font-semibold">Demande pour moi</span>
      </label>

      {/* Option 2: Demande pour tiers */}
      <label className="flex items-center cursor-pointer space-x-2">
        <span
          className={`w-5 h-5 rounded-full border-2 border-none flex bg-white items-center justify-center ${selected === 'tiers' ? 'border-red-500' : ''
            }`}
        >
          {selected === 'tiers' && <span className="w-5 h-5 bg-red-500 rounded-full"></span>}
        </span>
        <input
          type="radio"
          name="demande"
          value="tiers"
          checked={selected === 'tiers'}
          onChange={() => handleChange('tiers')}
          className="hidden"
        />
        <span className="text-sm font-semibold">Demande pour tiers</span>
      </label>
    </div>
  );
};

export default RadioSelect;
