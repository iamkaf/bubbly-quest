import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { HTMLMotionProps } from 'framer-motion';

interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'variants' | 'whileHover' | 'whileTap'> {
  variant?: 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className, ...props }: ButtonProps) => {
  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      y: 0,
      transition: { duration: 0.1 },
    },
  };

  const variantStyles = {
    primary: 'bg-[var(--accent-primary)] text-[var(--text-primary)]',
    secondary: 'bg-[var(--accent-secondary)] text-[var(--text-primary)]',
    accent: 'bg-[var(--accent-tertiary)] text-[var(--text-primary)]',
  };

  return (
    <motion.button
      className={clsx(
        'px-6 py-3 rounded-[var(--border-radius-medium)]',
        'font-semibold cursor-pointer border-none',
        'shadow-[var(--shadow-light)] transition-shadow',
        'hover:shadow-[var(--shadow-medium)]',
        variantStyles[variant],
        className,
      )}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
