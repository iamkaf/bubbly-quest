import { useEffect, useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout, MainMenu, GameScreen, EditorScreen, SettingsScreen } from '@/components';
import { useAdventureStore } from '@/stores';
import { initializeApp } from '@/services/initialize';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const loadAdventureList = useAdventureStore((state) => state.loadAdventureList);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in development
    if (hasInitialized.current) {
      console.log('[App] Already initialized, skipping...');
      return;
    }
    hasInitialized.current = true;

    async function initialize() {
      console.log('[App] Starting initialization...');

      try {
        const result = await initializeApp();

        if (result.success) {
          console.log('[App] Initialization successful!');

          if (result.isFirstRun) {
            console.log('[App] Welcome! First run detected.');
          }

          // Load adventure list into store
          if (result.adventureList) {
            loadAdventureList(result.adventureList);
            console.log(`[App] Loaded ${result.adventureList.adventures.length} adventure(s)`);
          }

          setIsInitializing(false);
        } else {
          console.error('[App] Initialization failed:', result.errors);
          setInitError(result.errors.join(', '));
          setIsInitializing(false);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[App] Initialization error:', message);
        setInitError(`Failed to initialize: ${message}`);
        setIsInitializing(false);
      }
    }

    initialize();
  }, [loadAdventureList]);

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-title)' }}>
              Bubbly Quest
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Initializing...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error screen if initialization failed
  if (initError) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-title)' }}>
              Initialization Error
            </h1>
            <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
              {initError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full"
              style={{
                background: 'var(--accent-primary)',
                color: 'var(--bg-primary)',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Normal app flow
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
