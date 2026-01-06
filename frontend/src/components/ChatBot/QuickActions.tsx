import React from 'react';
import { Plus, List, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickActionsProps {
  onAction: (message: string) => void;
  disabled?: boolean;
}

const quickActions = [
  {
    id: 'add',
    label: 'Add task',
    icon: Plus,
    message: 'I want to add a new task'
  },
  {
    id: 'pending',
    label: 'Pending tasks',
    icon: List,
    message: 'Show my pending tasks'
  },
  {
    id: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    message: 'Show my completed tasks'
  },
  {
    id: 'suggest',
    label: 'Suggest',
    icon: Sparkles,
    message: 'Suggest some tasks for me'
  }
];

export default function QuickActions({ onAction, disabled = false }: QuickActionsProps) {
  return (
    <div className="flex gap-2 px-1 py-1 overflow-x-auto scrollbar-none pb-2" role="toolbar" aria-label="Quick actions">
      {quickActions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction(action.message)}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={action.label}
          >
            <Icon size={14} className="text-gray-500 group-hover:text-gray-700" />
            <span>{action.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
