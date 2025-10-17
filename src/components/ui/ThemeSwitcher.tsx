import React from 'react';
import { useThemeStore } from '@/stores/ThemeStore';

const themes = [
  'bubbly-original',
  'strawberry-sunset',
  'matcha-mochi',
  'sakura-spring',
  'cozy-cottage',
  'midnight-cozy',
  'starlight-velvet',
  'arcade-night',
  'autumn-grimoire',
  'abyssal-tide',
];

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="p-4">
      <label htmlFor="theme-select" className="mr-2">
        Theme:
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="p-2 rounded bg-background text-foreground border"
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSwitcher;