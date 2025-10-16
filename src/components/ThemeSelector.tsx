import { useUIStore } from '@/stores';
import type { Theme } from '@/types';

const themes: { value: Theme; label: string }[] = [
  { value: 'bubbly-original', label: 'Bubbly Original 🫧' },
  { value: 'midnight-cozy', label: 'Midnight Cozy 🌃' },
  { value: 'strawberry-sunset', label: 'Strawberry Sunset 🍓' },
  { value: 'matcha-mochi', label: 'Matcha Mochi 🍵' },
  { value: 'sakura-spring', label: 'Sakura Spring 🌸' },
  { value: 'cozy-cottage', label: 'Cozy Cottage 🧸' },
  { value: 'starlight-velvet', label: 'Starlight Velvet ✨' },
  { value: 'arcade-night', label: 'Arcade Night 👾' },
  { value: 'autumn-grimoire', label: 'Autumn Grimoire 🎃' },
  { value: 'abyssal-tide', label: 'Abyssal Tide 🌊' },
];

export const ThemeSelector = () => {
  const { theme, setTheme } = useUIStore();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as Theme)}
      className="px-4 py-2 rounded-[var(--border-radius-medium)] bg-[var(--bg-secondary)] text-[var(--text-primary)] border-2 border-[var(--accent-primary)] cursor-pointer font-semibold shadow-[var(--shadow-light)] hover:shadow-[var(--shadow-medium)] transition-shadow"
    >
      {themes.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </select>
  );
};

export default ThemeSelector;
