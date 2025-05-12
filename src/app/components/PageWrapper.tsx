import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = "" }) => (
  <div className={`w-full max-w-full mt-2 mb-2 px-2 sm:px-0 ${className}`}>
    {children}
  </div>
);

export default PageWrapper; 