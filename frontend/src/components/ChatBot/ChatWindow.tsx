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
      content: 'Hi! I\'m your task assistant. I can help you add, view, update, and manage your tasks. What would you like to do?',
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
  }, [messages]);

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
      setError(err.response?.data?.detail || 'Failed to send message. Please try again.');
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
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
          className="fixed bottom-4 right-4 w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 md:max-w-md sm:bottom-0 sm:right-0 sm:rounded-none sm:h-full sm:max-w-full"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BotAvatar state="idle" size={40} />
              <div>
                <h3 className="font-semibold text-base">Task Assistant</h3>
                <p className="text-xs text-purple-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Actions */}
          <QuickActions onAction={handleQuickAction} disabled={isLoading} />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50" role="log" aria-live="polite">
            {messages.map((msg, index) => (
              <MessageBubble
                key={index}
                role={msg.role}
                content={msg.content}
                timestamp={msg.created_at}
                isLatest={index === messages.length - 1 && msg.role === 'assistant' && isLoading}
              />
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 mb-4">
                <BotAvatar state="typing" size={40} />
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <Composer onSend={handleSendMessage} disabled={isLoading} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
