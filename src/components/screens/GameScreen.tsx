import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigationStore } from '@/stores/NavigationStore';

const GameScreen: React.FC = () => {
  const { setCurrentScreen } = useNavigationStore();

  return (
    <div>
      <h1>Game Screen</h1>
      <Link to="/" onClick={() => setCurrentScreen('main-menu')}>
        Back to Main Menu
      </Link>
    </div>
  );
};

export default GameScreen;