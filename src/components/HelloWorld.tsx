import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sparkle } from 'phosphor-react';
import '@fontsource/baloo-2';
import '@fontsource/rubik-mono-one';
import '@/styles/themes.css';

const HelloWorld = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleTheme = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setTheme(theme === 'light' ? 'dark' : 'light');
      setIsAnimating(false);
    }, 300);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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

  const buttonVariants = {
    hover: {
      scale: 1.05,
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div
      data-theme={theme === 'dark' ? 'midnight-cozy' : ''}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        transition: 'all 0.3s ease',
      }}
    >
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ textAlign: 'center', maxWidth: '600px' }}
      >
        <motion.div variants={itemVariants}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'inline-block', marginBottom: '20px' }}
          >
            <Sparkle size={48} color="var(--accent-primary)" weight="fill" />
          </motion.div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: '3rem',
            color: 'var(--text-primary)',
            marginBottom: '16px',
            fontFamily: 'var(--font-title)',
          }}
        >
          Welcome to Bubbly Quest!
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            lineHeight: 1.6,
          }}
        >
          A delightful text-based adventure game engine with a playful, toy-like user experience.
          This is Phase 1 of our implementation.
        </motion.p>

        <motion.div variants={itemVariants} className="card">
          <h2
            style={{
              color: 'var(--accent-primary)',
              marginBottom: '16px',
              fontSize: '1.5rem',
            }}
          >
            Hello World! 🫧
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            The foundation is set up with:
          </p>
          <ul
            style={{
              textAlign: 'left',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
            }}
          >
            <li>✨ Tauri + React + TypeScript</li>
            <li>🎨 Bubbly theme system</li>
            <li>🎭 Framer Motion animations</li>
            <li>📦 Zustand state management</li>
            <li>🎯 Phosphor React icons</li>
            <li>🔧 ESLint & Prettier configuration</li>
          </ul>
        </motion.div>

        <motion.div variants={itemVariants} style={{ marginTop: '32px' }}>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={toggleTheme}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--accent-secondary)',
              color: 'var(--text-primary)',
              padding: '12px 24px',
              borderRadius: 'var(--border-radius-medium)',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {theme === 'light' ? (
              <>
                <Moon size={20} />
                Switch to Dark Mode
              </>
            ) : (
              <>
                <Sun size={20} />
                Switch to Light Mode
              </>
            )}
          </motion.button>
        </motion.div>

        {isAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'var(--bg-primary)',
              zIndex: 9999,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default HelloWorld;
