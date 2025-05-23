import React from 'react';
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from '@/src/hooks/useToast';

const Toast = () => {
  const { message, type, isVisible, hideToast } = useToast();

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 max-w-xs w-full bg-white shadow-md rounded-lg p-4 flex items-center gap-3 transform transition-all duration-300 z-[2000] ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-[-20px] opacity-0"
      }`}
    >
      <div
        className={`${
          type === "error" ? "bg-red-500" : "bg-green-500"
        } p-2 rounded-full`}
      >
        {type === "error" ? (
          <AlertCircle className="text-white h-5 w-5" />
        ) : (
          <CheckCircle className="text-white h-5 w-5" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm text-gray-800">
          {type === "error" ? "Erreur" : "Succès"}
        </p>
        <p className="text-xs text-gray-500">{message}</p>
      </div>
      <button
        className="text-gray-400 hover:text-gray-600 transition-colors"
        onClick={hideToast}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast; 