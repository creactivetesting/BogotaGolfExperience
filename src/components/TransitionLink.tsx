"use client";

import Link, { LinkProps } from 'next/link';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface TransitionLinkProps extends Omit<LinkProps, 'href'> {
  to: string;
  children: ReactNode;
  className?: string;
}

export function TransitionLink({ to, children, className = '', ...props }: TransitionLinkProps) {
  return (
    <Link href={to} className={className} {...props}>
      <motion.div
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </Link>
  );
}
