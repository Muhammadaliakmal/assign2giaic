import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import BotAvatar from './BotAvatar';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  isLatest?: boolean;
}

export default function MessageBubble({ role, content, timestamp, isLatest = false }: MessageBubbleProps) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-2 group w-full`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mt-0.5">
          <BotAvatar state={isLatest ? 'typing' : 'idle'} size={24} />
        </div>
      )}

      {/* Message content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
        <div
          className={`px-4 py-2 rounded-2xl relative text-sm ${
            isUser
              ? 'bg-gray-100 text-gray-900 rounded-tr-sm'
              : 'bg-transparent text-gray-900 px-0 py-0'
          }`}
          role="article"
          aria-label={`${role} message`}
        >
          {/* Markdown Content */}
          <div className={`leading-relaxed prose prose-sm max-w-none ${isUser ? '' : 'prose-neutral'}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="rounded-md overflow-hidden my-2 border border-gray-200 bg-gray-50">
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, padding: '0.8rem', fontSize: '0.8rem' }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={`${className} bg-gray-100 px-1 py-0.5 rounded text-xs font-mono`} {...props}>
                      {children}
                    </code>
                  );
                },
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 marker:text-gray-400">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 marker:text-gray-400">{children}</ol>,
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Copy Button (Assistant only) */}
          {!isUser && (
            <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
               <button 
                  onClick={handleCopy}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Copy message"
               >
                  {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
               </button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && isUser && (
          <span className="text-[10px] text-gray-400 mt-1 px-1">
            {format(new Date(timestamp), 'h:mm a')}
          </span>
        )}
      </div>

      {/* User avatar - hidden for clean look, or minimal */}
      {isUser && (
         <div className="hidden"></div>
      )}
    </motion.div>
  );
}
