import React from "react";

// Types
interface ReferenceData {
  id: string;
  label: string;
  value: string;
}

// Composant Select dynamique
interface DynamicSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: ReferenceData[];
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  hasError?: boolean;
}

export const DynamicSelect: React.FC<DynamicSelectProps> = React.memo(
  ({
    label,
    name,
    value,
    onChange,
    options,
    required = false,
    disabled = false,
    isLoading = false,
    hasError = false,
  }) => (
    <div className="mb-4">
      <label className="block mb-1.5 text-sm font-medium text-gray-700">
        {label} {required && <span className="text-[#EB4F47]">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`appearance-none w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm text-gray-700 ${
            hasError ? "border-red-300" : "border-gray-300"
          }`}
          required={required}
          disabled={disabled || isLoading}
        >
          <option value="">
            {isLoading ? "Chargement..." : hasError ? "Erreur" : "Sélectionner"}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          ) : hasError ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </div>
      {hasError && (
        <p className="mt-1 text-xs text-red-500">
          Erreur lors du chargement des données
        </p>
      )}
    </div>
  )
);

DynamicSelect.displayName = "DynamicSelect";

// Composant Radio personnalisé
interface CustomRadioProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export const CustomRadio: React.FC<CustomRadioProps> = React.memo(
  ({ name, value, checked, onChange, label }) => (
    <label className={`flex items-center space-x-3 cursor-pointer group`}>
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 border rounded-full transition-all ${
            checked
              ? "border-[#EB4F47]"
              : "border-gray-300 group-hover:border-gray-400"
          }`}
        >
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all ${
              checked ? "bg-[#EB4F47] scale-100" : "bg-transparent scale-0"
            }`}
          ></div>
        </div>
      </div>
      <span
        className={`text-sm ${
          checked ? "text-gray-800 font-medium" : "text-gray-600"
        }`}
      >
        {label}
      </span>
    </label>
  )
);

CustomRadio.displayName = "CustomRadio";

// Composant Checkbox personnalisé
interface CustomCheckboxProps {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = React.memo(
  ({ name, checked, onChange, label, required = false }) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only"
          required={required}
        />
        <div
          className={`w-5 h-5 border rounded transition-all ${
            checked
              ? "bg-[#EB4F47] border-[#EB4F47]"
              : "border-gray-300 group-hover:border-gray-400"
          } flex items-center justify-center`}
        >
          {checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm text-gray-700">
        {label} {required && <span className="text-[#EB4F47]">*</span>}
      </span>
    </label>
  )
);

CustomCheckbox.displayName = "CustomCheckbox";

// Composant Input personnalisé
interface CustomInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = React.memo(
  ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
  }) => (
    <div className="mb-4">
      <label className="block mb-1.5 text-sm font-medium text-gray-700">
        {label} {required && <span className="text-[#EB4F47]">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm"
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
);

CustomInput.displayName = "CustomInput";
