'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { tasksAPI, Task } from '@/lib/api';
import Sidebar from '@/components/layout/Sidebar';
import TaskInput from '@/components/dashboard/TaskInput';
import TaskItem from '@/components/dashboard/TaskItem';
import EmptyState from '@/components/dashboard/EmptyState';
import EditTaskModal from '@/components/dashboard/EditTaskModal';
import ChatWindow from '@/components/ChatBot/ChatWindow';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { format } from 'date-fns';
import { Filter, Search, LayoutDashboard, Plus, Calendar, Star, Settings, MessageCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch tasks
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await tasksAPI.getAll(user.id);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title: string, description: string) => {
    if (!user) return;
    try {
      const newTask = await tasksAPI.create(user.id, { title, description });
      setTasks([newTask, ...tasks]);
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    if (!user) return;
    try {
      const updatedTask = await tasksAPI.toggleComplete(user.id, taskId);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleEditTaskSave = async (taskId: number, title: string, description: string) => {
    if (!user) return;
    try {
      const updatedTask = await tasksAPI.update(user.id, taskId, { title, description });
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!user) return;
    try {
      await tasksAPI.delete(user.id, taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'completed') return task.completed && matchesSearch;
    return matchesSearch;
  }).sort((a, b) => {
    // Show completed at bottom
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const tasksRemaining = tasks.filter(t => !t.completed).length;

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      {/* Sidebar - Desktop */}
      <Sidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-8 lg:px-12 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-1">
                        {format(new Date(), 'EEEE, MMMM do')}
                    </h2>
                    <h1 className="text-3xl font-display font-bold text-text-primary">
                        Good morning, {user.username}
                    </h1>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-2xl font-bold text-text-primary">{tasksRemaining}</p>
                    <p className="text-xs font-medium text-text-secondary uppercase tracking-tighter">Tasks Remaining</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                    />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['all', 'completed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={cn(
                                "px-6 py-1.5 text-sm font-medium rounded-lg capitalize transition-all",
                                activeFilter === tab
                                    ? "bg-white text-text-primary shadow-sm"
                                    : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task Input */}
            <div className="mb-10">
                <TaskInput onAdd={handleAddTask} />
            </div>

            {/* Task List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredTasks.length > 0 ? (
                    <LayoutGroup>
                        <motion.div layout className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {filteredTasks.map((task) => (
                                    <TaskItem 
                                        key={task.id} 
                                        task={task} 
                                        onToggle={handleToggleComplete}
                                        onDelete={handleDeleteTask}
                                        onEdit={(t) => setEditingTask(t)}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </LayoutGroup>
                ) : (
                    <EmptyState />
                )}
            </div>
        </header>
      </main>

      {/* Edit Modal */}
      <EditTaskModal 
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleEditTaskSave}
      />

      {/* Mobile Nav - Bottom */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 z-50 flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 text-primary-600">
                <LayoutDashboard size={20} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-text-muted hover:text-text-primary">
                <Calendar size={20} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Today</span>
            </button>
            <button className="flex-shrink-0 -mt-8 bg-primary-600 w-12 h-12 rounded-full shadow-floating flex items-center justify-center text-white">
                <Plus size={24} />
            </button>
            <button className="flex flex-col items-center gap-1 text-text-muted hover:text-text-primary">
                <Star size={20} />
                <span className="text-[10px] uppercase font-bold tracking-widest">High</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-text-muted hover:text-text-primary">
                <Settings size={20} />
                <span className="text-[10px] uppercase font-bold tracking-widest">More</span>
            </button>
      </nav>

      {/* Floating Chat Button - Desktop */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="hidden lg:flex fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-2xl items-center justify-center hover:shadow-3xl hover:scale-110 transition-all z-40 chat-fab"
        aria-label="Open chat assistant"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {user && (
        <ChatWindow 
          userId={user.id} 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
}
