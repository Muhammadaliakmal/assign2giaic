/**
 * QuickActions Component
 * 
 * Quick reply buttons for common actions.
 */

'use client';

import React from 'react';
import { Plus, List, CheckCircle2 } from 'lucide-react';

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
    label: 'Show pending',
    icon: List,
    message: 'Show my pending tasks'
  },
  {
    id: 'completed',
    label: 'Show completed',
    icon: CheckCircle2,
    message: 'Show my completed tasks'
  }
];

export default function QuickActions({ onAction, disabled = false }: QuickActionsProps) {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto" role="toolbar" aria-label="Quick actions">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => onAction(action.message)}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={action.label}
          >
            <Icon size={16} />
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
