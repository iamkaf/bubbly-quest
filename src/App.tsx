import { Routes, Route } from 'react-router-dom';
import { Layout, MainMenu, GameScreen, EditorScreen, SettingsScreen } from '@/components';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/editor" element={<EditorScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </Layout>
  );
}

export default App;
