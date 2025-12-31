/**
 * MessageBubble Component
 * 
 * Displays individual chat messages with proper styling and accessibility.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import BotAvatar from './BotAvatar';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  isLatest?: boolean;
}

export default function MessageBubble({ role, content, timestamp, isLatest = false }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0">
          <BotAvatar state={isLatest ? 'typing' : 'idle'} size={40} />
        </div>
      )}

      {/* Message content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
              : 'bg-white border border-gray-200 text-gray-900'
          } shadow-sm`}
          role="article"
          aria-label={`${role} message`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className="text-xs text-gray-500 mt-1 px-1">
            {format(new Date(timestamp), 'h:mm a')}
          </span>
        )}
      </div>

      {/* User avatar placeholder */}
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
          U
        </div>
      )}
    </motion.div>
  );
}
