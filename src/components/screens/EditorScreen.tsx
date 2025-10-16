import { motion } from 'framer-motion';
import { ArrowLeft } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from '@/components';

export const EditorScreen = () => {
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
          <h1 className="text-4xl font-bold mb-4 text-[var(--accent-primary)] font-[var(--font-title)]">
            Fabula Machina - Adventure Editor
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-4">
            The adventure editor will be implemented in Phase 7: Adventure Editor.
          </p>
          <p className="text-[var(--text-muted)]">
            This screen will feature tabbed interfaces for editing Rooms, Items, and Monsters, with
            export functionality for creating adventure files.
          </p>
        </Card>
      </motion.div>
    </Container>
  );
};

export default EditorScreen;
