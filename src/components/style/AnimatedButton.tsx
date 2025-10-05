'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  onClick?: () => void;
  loading?: boolean;
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

export function AnimatedButton({
  onClick,
  loading = false,
  children,
  icon,
  variant = 'default',
  className = '',
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Button
        onClick={onClick}
        disabled={loading}
        variant={variant}
        className={`relative overflow-hidden group ${className}`}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_100%]"
          animate={{
            backgroundPosition: loading ? ['0% 50%', '100% 50%'] : '0% 50%',
          }}
          transition={{
            duration: 2,
            repeat: loading ? Infinity : 0,
            ease: 'linear',
          }}
        />
        
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : icon ? (
            icon
          ) : null}
          {children}
        </span>
      </Button>
    </motion.div>
  );
}
