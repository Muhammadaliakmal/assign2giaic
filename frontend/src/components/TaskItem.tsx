'use client';

import { CheckCircle, Circle, Pencil, Trash2 } from 'lucide-react';
import { Task } from '@/lib/api';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  return (
    <div 
      className={`task-item ${task.completed ? 'task-item-completed' : ''} animate-scale-in`}
    >
      {/* Completion Toggle */}
      <button
        onClick={() => onToggleComplete(task.id)}
        className="btn-icon flex-shrink-0"
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed ? (
          <CheckCircle className="w-6 h-6 text-primary-500" />
        ) : (
          <Circle className="w-6 h-6 text-slate-400 hover:text-primary-500 transition-colors" />
        )}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <h3 
          className={`font-medium text-slate-900 mb-1 ${
            task.completed ? 'line-through text-slate-500' : ''
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p 
            className={`text-sm text-slate-600 line-clamp-2 ${
              task.completed ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="btn-icon"
          aria-label="Edit task"
        >
          <Pencil className="w-5 h-5 text-slate-500 hover:text-primary-600 transition-colors" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="btn-icon"
          aria-label="Delete task"
        >
          <Trash2 className="w-5 h-5 text-slate-500 hover:text-red-600 transition-colors" />
        </button>
      </div>
    </div>
  );
}
