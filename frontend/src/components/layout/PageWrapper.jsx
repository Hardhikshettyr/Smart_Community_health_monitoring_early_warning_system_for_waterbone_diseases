import React from 'react';
import { motion } from 'framer-motion';

export function PageWrapper({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`min-h-[calc(100vh-5rem-16rem)] ${className}`}
    >
      {children}
    </motion.main>
  );
}

export default PageWrapper;
