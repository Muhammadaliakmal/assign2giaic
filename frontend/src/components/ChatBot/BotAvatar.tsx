/**
 * BotAvatar Component
 * 
 * Animated bot avatar with different states.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import animations from '@/animations/bot-animations.json';

export type BotState = 'idle' | 'listening' | 'thinking' | 'typing' | 'success' | 'error';

interface BotAvatarProps {
  state?: BotState;
  size?: number;
  className?: string;
}

export default function BotAvatar({ state = 'idle', size = 48, className = '' }: BotAvatarProps) {
  const getAnimation = (): any => {
    const anim = animations[state] as any;
    
    switch (anim.type) {
      case 'pulse':
        return {
          scale: anim.scale || [1, 1.05, 1],
          transition: {
            duration: anim.duration / 1000,
            repeat: anim.repeat ? Infinity : 0,
            ease: 'easeInOut'
          }
        };
      
      case 'rotate':
        return {
          rotate: [0, 360],
          transition: {
            duration: anim.duration / 1000,
            repeat: anim.repeat ? Infinity : 0,
            ease: 'linear'
          }
        };
      
      case 'bounce':
        return {
          y: [-2, 2, -2],
          transition: {
            duration: anim.duration / 1000,
            repeat: anim.repeat ? Infinity : 0,
            ease: 'easeInOut'
          }
        };
      
      case 'scale':
        return {
          scale: anim.scale || [1, 1.2, 1],
          transition: {
            duration: anim.duration / 1000,
            ease: 'easeOut'
          }
        };
      
      case 'shake':
        return {
          x: anim.offset || [-5, 5, -5, 5, 0],
          transition: {
            duration: anim.duration / 1000,
            ease: 'easeInOut'
          }
        };
      
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      animate={getAnimation()}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle cx="24" cy="24" r="24" fill="url(#gradient)" />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        
        {/* Robot head */}
        <rect x="14" y="16" width="20" height="18" rx="3" fill="white" opacity="0.95" />
        
        {/* Eyes */}
        <circle cx="19" cy="23" r="2" fill="#8B5CF6" />
        <circle cx="29" cy="23" r="2" fill="#8B5CF6" />
        
        {/* Smile */}
        <path d="M 18 28 Q 24 31 30 28" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Antenna */}
        <line x1="24" y1="16" x2="24" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="11" r="2" fill="white" />
        
        {/* Decorative dots */}
        <circle cx="24" cy="19" r="0.8" fill="#8B5CF6" opacity="0.5" />
      </svg>
    </motion.div>
  );
}
