import React from 'react';
import { clsx } from 'clsx';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return <div className={clsx('max-w-[1200px] mx-auto p-5', className)}>{children}</div>;
};

export default Container;
