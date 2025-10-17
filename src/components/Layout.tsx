import React from 'react';
import { useThemeStore } from '@/stores/ThemeStore';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useThemeStore();

  return (
    <div className="min-h-screen bg-background text-foreground" data-theme={theme}>
      <ThemeSwitcher />
      <main>{children}</main>
    </div>
  );
};

export default Layout;