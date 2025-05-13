import React, { createContext, useContext, useState, ReactNode } from 'react';
import Loader from '../app/components/animation/loader';

interface LoaderContextType {
  showLoader: (context?: string) => void;
  hideLoader: () => void;
  isLoading: boolean;
  context: string;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState('');

  const showLoader = (context: string = '') => {
    setContext(context);
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
    setContext('');
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading, context }}>
      {children}
      {isLoading && <Loader context={context} />}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
} 