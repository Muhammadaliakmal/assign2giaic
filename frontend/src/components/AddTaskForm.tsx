'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddTaskFormProps {
  onAdd: (title: string, description: string) => Promise<void>;
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onAdd(title, description);
      setTitle('');
      setDescription('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Task
      </button>
    );
  }

  return (
    <div className="card p-6 animate-scale-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
            Task Title
          </label>
          <input
            id="title"
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
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
            Description (optional)
          </label>
          <textarea
            id="description"
            rows={3}
            className="input resize-none"
            placeholder="Add more details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add Task
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setTitle('');
              setDescription('');
            }}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
