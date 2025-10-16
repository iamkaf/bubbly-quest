import { motion } from 'framer-motion';
import { ArrowLeft } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from '@/components';

export const GameScreen = () => {
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
            Game Player
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-4">
            The game player will be implemented in Phase 5: Game Engine Core.
          </p>
          <p className="text-[var(--text-muted)]">
            This screen will feature the command parser, room descriptions, inventory management,
            and combat systems.
          </p>
        </Card>
      </motion.div>
    </Container>
  );
};

export default GameScreen;
