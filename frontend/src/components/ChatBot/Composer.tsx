import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function Composer({ 
  onSend, 
  disabled = false, 
  placeholder = 'Message Task Assistant...' 
}: ComposerProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="relative">
      <div 
        className={`flex items-end gap-2 bg-white rounded-xl border transition-all duration-200 px-3 py-2 ${
          isFocused ? 'border-gray-400 shadow-sm' : 'border-gray-300'
        }`}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent px-1 py-1 text-sm focus:outline-none text-gray-800 placeholder:text-gray-400 disabled:opacity-50 max-h-[120px] overflow-y-auto w-full"
          aria-label="Message input"
        />
        
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            message.trim() && !disabled
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          {message.trim() ? <Send size={14} /> : <Sparkles size={14} className="text-gray-400" />}
        </button>
      </div>
      
      <div className="text-center mt-2">
        <p className="text-[10px] text-gray-400">
          AI can make mistakes. Please check important info.
        </p>
      </div>
    </div>
  );
}
