'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/lib/api';

interface EditTaskModalProps {
  task: Task | null;
  onSave: (taskId: number, title: string, description: string) => Promise<void>;
  onClose: () => void;
}

export default function EditTaskModal({ task, onSave, onClose }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSave(task.id, title, description);
      onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="card p-6 max-w-lg w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
          Edit Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 mb-2">
              Task Title
            </label>
            <input
              id="edit-title"
              type="text"
              required
              autoFocus
              className="input"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="edit-description"
              rows={4}
              className="input resize-none"
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
