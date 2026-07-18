'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface PageLoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const PageLoadingContext = createContext<PageLoadingContextType | undefined>(undefined);

export function PageLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fade out loading spinner after hydration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {mounted && isLoading && (
        <LoadingSpinner fullScreen label="Loading portfolio..." />
      )}
      {children}
    </PageLoadingContext.Provider>
  );
}

export function usePageLoading() {
  const context = useContext(PageLoadingContext);
  if (context === undefined) {
    throw new Error('usePageLoading must be used within PageLoadingProvider');
  }
  return context;
}
