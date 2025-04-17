'use client';

import { useState } from 'react';

const RadioSelect = () => {
  const [selected, setSelected] = useState<'moi' | 'tiers'>('moi');

  return (
    <div className="flex justify-between items-center space-x-4">
      {/* Option 1: Demande pour moi */}
      <label className="flex items-center cursor-pointer space-x-2">
        <span
          className={`w-5 h-5 rounded-full border-2 border-none flex bg-white items-center justify-center ${
            selected === 'moi' ? 'border-red-500' : ''
          }`}
        >
          {selected === 'moi' && <span className="w-5 h-5 bg-red-500 rounded-full"></span>}
        </span>
        <input
          type="radio"
          name="demande"
          value="moi"
          checked={selected === 'moi'}
          onChange={() => setSelected('moi')}
          className="hidden"
        />
        <span className="text-sm font-semibold">Demande pour moi</span>
      </label>

      {/* Option 2: Demande pour tiers */}
      <label className="flex items-center cursor-pointer space-x-2">
        <span
          className={`w-5 h-5 rounded-full border-2 border-none flex bg-white items-center justify-center ${
            selected === 'tiers' ? 'border-red-500' : ''
          }`}
        >
          {selected === 'tiers' && <span className="w-5 h-5 bg-red-500 rounded-full"></span>}
        </span>
        <input
          type="radio"
          name="demande"
          value="tiers"
          checked={selected === 'tiers'}
          onChange={() => setSelected('tiers')}
          className="hidden"
        />
        <span className="text-sm font-semibold">Demande pour tiers</span>
      </label>
    </div>
  );
};

export default RadioSelect;
