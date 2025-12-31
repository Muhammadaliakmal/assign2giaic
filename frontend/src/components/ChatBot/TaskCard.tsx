/**
 * TaskCard Component
 * 
 * Displays task information in chat context.
 */

'use client';

import React from 'react';
import { CheckCircle, Circle, Trash2, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskCardProps {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  onComplete?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

export default function TaskCard({
  id,
  title,
  description,
  completed,
  onComplete,
  onDelete,
  onEdit
}: TaskCardProps) {
  return (
    <motion.div
      className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 my-2 max-w-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onComplete?.(id)}
          className="flex-shrink-0 mt-0.5 text-purple-600 hover:text-purple-700 transition-colors"
          aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {completed ? <CheckCircle size={20} /> : <Circle size={20} />}
        </button>

        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-sm ${completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {title}
          </h4>
          {description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <div className="flex gap-1 flex-shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(id)}
              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              aria-label="Edit task"
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete task"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
