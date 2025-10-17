// UI component interfaces
export interface ButtonProps {
  variant: 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
  size: 'sm' | 'default' | 'lg' | 'icon';
  isLoading?: boolean;
  disabled?: boolean;
}

// Game state interfaces (matching C.H.A.R.G.E.)
export interface Player {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  xp: number;
  maxXp: number;
  gold: number;
}

// Navigation and routing types
export type Screen = 'main-menu' | 'game' | 'editor' | 'settings';