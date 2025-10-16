import React from 'react';
import { useUIStore } from '@/stores';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme } = useUIStore();

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300"
    >
      {children}
    </div>
  );
};

export default Layout;
