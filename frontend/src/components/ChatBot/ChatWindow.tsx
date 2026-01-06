/**
 * ChatWindow Component
 * 
 * Main chat interface container with message history and composer.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import Composer from './Composer';
import QuickActions from './QuickActions';
import BotAvatar from './BotAvatar';
import { sendMessage, ChatMessage } from '@/lib/chatApi';

interface ChatWindowProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWindow({ userId, isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I am your task assistant. I can help you add, view, update, and manage your tasks. What would you like to do?',
      created_at: new Date().toISOString()
    }
  ]);
  const [conversationId, setConversationId] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    // Add user message immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      created_at: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(userId, content, conversationId);
      
      // Update conversation ID if this is the first message
      if (!conversationId) {
        setConversationId(response.conversation_id);
      }

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        created_at: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to send message. Please try again.';
      setError(errorMsg);
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: errorMsg,
        created_at: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (message: string) => {
    handleSendMessage(message);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 w-full max-w-[400px] h-[600px] rounded-lg shadow-xl flex flex-col overflow-hidden z-50 md:max-w-md sm:bottom-0 sm:right-0 sm:rounded-none sm:h-full sm:max-w-full bg-white border border-gray-200"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2">
              <BotAvatar state={isLoading ? 'thinking' : 'idle'} size={32} />
              <div>
                <h3 className="font-semibold text-sm text-gray-800">Assistant</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent" role="log" aria-live="polite">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <MessageBubble
                  key={index}
                  role={msg.role}
                  content={msg.content || ''}
                  timestamp={msg.created_at}
                  isLatest={index === messages.length - 1 && msg.role === 'assistant' && isLoading}
                />
              ))}
            </AnimatePresence>
            
            {/* Loading indicator */}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 mt-1">
                  <BotAvatar state="typing" size={24} />
                </div>
                <div className="text-gray-400 text-sm flex items-center gap-1">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </motion.div>
            )}
            
            {/* Error message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-100 rounded-md px-3 py-2 text-xs text-red-600 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions & Composer */}
          <div className="bg-white border-t border-gray-100 p-4">
             {/* Quick Actions - Only show if no messages or just welcome message */}
            {messages.length <= 2 && (
               <div className="mb-3">
                  <QuickActions onAction={handleQuickAction} disabled={isLoading} />
               </div>
            )}
            <Composer onSend={handleSendMessage} disabled={isLoading} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
