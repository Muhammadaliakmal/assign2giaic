'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Trash2, Edit3, Flag } from 'lucide-react';
import { Task } from '@/lib/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (task: Task) => void;
}

const priorityColors = {
    high: "bg-red-50 text-red-600",
    medium: "bg-amber-50 text-amber-600",
    low: "bg-blue-50 text-blue-600",
};

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
    return (
        <motion.div
            layoutId={`task-${task.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2 }}
            className={cn(
                "group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl transition-all duration-200",
                task.completed ? "bg-slate-50 border-transparent shadow-none" : "shadow-card hover:border-primary-200"
            )}
        >
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={() => onToggle(task.id)}
                    className="relative focus:outline-none"
                    aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                    <AnimatePresence mode="wait">
                        {task.completed ? (
                            <motion.div
                                key="checked"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className="text-primary-600"
                            >
                                <CheckCircle2 size={24} strokeWidth={2.5} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="unchecked"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className="text-slate-300 group-hover:text-primary-400 transition-colors"
                            >
                                <Circle size={24} strokeWidth={1.5} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>

                <div className="flex flex-col min-w-0 flex-1">
                    <div className="relative inline-flex">
                        <span className={cn(
                            "text-[15px] font-medium truncate transition-all duration-500",
                            task.completed ? "text-text-muted line-through" : "text-text-primary"
                        )}>
                            {task.title}
                        </span>
                        {task.completed && (
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="absolute left-0 top-1/2 h-[1.5px] bg-text-muted"
                            />
                        )}
                    </div>
                    {task.description && !task.completed && (
                        <p className="text-xs text-text-secondary truncate mt-0.5">
                            {task.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 text-text-secondary hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        title="Edit Task"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-1.5 text-text-secondary hover:text-status-error hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Task"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
