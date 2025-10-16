import { motion } from 'framer-motion';
import { GameController, PencilLine, Gear, Sparkle } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from '@/components';

export const MainMenu = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Container className="flex items-center justify-center min-h-screen">
      <motion.div
        className="w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-6"
          >
            <Sparkle size={64} color="var(--accent-primary)" weight="fill" />
          </motion.div>
          <h1 className="text-6xl font-bold mb-4 text-[var(--text-primary)] font-[var(--font-title)]">
            Bubbly Quest
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            A delightful text-based adventure game engine
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="space-y-4">
            <Button
              variant="primary"
              className="w-full flex items-center justify-center gap-3 text-lg"
              onClick={() => navigate('/game')}
            >
              <GameController size={24} weight="fill" />
              Play Adventure
            </Button>

            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-3 text-lg"
              onClick={() => navigate('/editor')}
            >
              <PencilLine size={24} weight="fill" />
              Adventure Editor
            </Button>

            <Button
              variant="accent"
              className="w-full flex items-center justify-center gap-3 text-lg"
              onClick={() => navigate('/settings')}
            >
              <Gear size={24} weight="fill" />
              Settings
            </Button>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mt-6 text-[var(--text-muted)]">
          <p className="text-sm">Phase 2: Core Architecture & State Management</p>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default MainMenu;
