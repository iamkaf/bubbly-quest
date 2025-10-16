import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card = ({ children, className, hoverable = true }: CardProps) => {
  const cardVariants = {
    rest: {
      y: 0,
      boxShadow: 'var(--shadow-light)',
    },
    hover: hoverable
      ? {
          y: -4,
          boxShadow: 'var(--shadow-medium)',
          transition: { duration: 0.3 },
        }
      : {},
  };

  return (
    <motion.div
      className={clsx(
        'bg-[var(--bg-secondary)] rounded-[var(--border-radius-large)]',
        'p-6 shadow-[var(--shadow-light)] transition-all',
        className,
      )}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
    >
      {children}
    </motion.div>
  );
};

export default Card;
