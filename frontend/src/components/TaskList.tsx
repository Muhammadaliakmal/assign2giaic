'use client';

import { Task } from '@/lib/api';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggleComplete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskList({ 
  tasks, 
  loading, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}: TaskListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-24 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
