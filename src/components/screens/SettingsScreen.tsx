import { motion } from 'framer-motion';
import { ArrowLeft } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, ThemeSelector } from '@/components';

export const SettingsScreen = () => {
  const navigate = useNavigate();

  return (
    <Container className="min-h-screen py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="secondary"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} />
          Back to Menu
        </Button>

        <Card>
          <h1 className="text-4xl font-bold mb-6 text-[var(--accent-primary)] font-[var(--font-title)]">
            Settings
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-[var(--text-primary)]">
                Theme Selection
              </h2>
              <p className="text-[var(--text-secondary)] mb-4">
                Choose from 8 playful themes to customize your experience:
              </p>
              <ThemeSelector />
            </div>

            <div className="pt-6 border-t-2 border-[var(--bg-tertiary)]">
              <h3 className="text-lg font-semibold mb-2 text-[var(--text-secondary)]">
                Additional Settings
              </h3>
              <p className="text-[var(--text-muted)]">
                More settings will be added in future phases, including audio controls, gameplay
                preferences, and accessibility options.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </Container>
  );
};

export default SettingsScreen;
