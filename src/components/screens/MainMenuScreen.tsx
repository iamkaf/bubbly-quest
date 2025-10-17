import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigationStore } from '@/stores/NavigationStore';

const MainMenuScreen: React.FC = () => {
  const { setCurrentScreen } = useNavigationStore();

  return (
    <div>
      <h1>Main Menu</h1>
      <nav>
        <ul>
          <li>
            <Link to="/game" onClick={() => setCurrentScreen('game')}>
              Play Game
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MainMenuScreen;