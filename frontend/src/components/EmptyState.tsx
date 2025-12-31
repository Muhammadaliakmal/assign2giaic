'use client';

import { ListTodo } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="empty-state animate-fade-in">
      <div className="mb-6">
        <ListTodo className="w-20 h-20 text-slate-300 mx-auto" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold text-slate-700 mb-2">
        No tasks yet
      </h3>
      <p className="text-slate-500 max-w-sm">
        Get started by creating your first task. Click the "Add Task" button above to begin.
      </p>
    </div>
  );
}
