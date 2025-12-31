'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';
import { Task } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface EditTaskModalProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (taskId: number, title: string, description: string) => Promise<void>;
}

export default function EditTaskModal({ task, isOpen, onClose, onSave }: EditTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!task || !title.trim() || isSaving) return;

        setIsSaving(true);
        try {
            await onSave(task.id, title, description);
            onClose();
        } catch (error) {
            console.error('Failed to save task:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[70] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-2xl shadow-floating pointer-events-auto overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <h2 className="text-xl font-display font-bold text-text-primary">Edit Task</h2>
                                <button 
                                    onClick={onClose}
                                    className="p-2 text-text-muted hover:text-text-primary hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <Input
                                    label="Task Title"
                                    id="edit-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="What needs to be done?"
                                    required
                                    autoFocus
                                />

                                <div className="space-y-2">
                                    <label htmlFor="edit-desc" className="block text-sm font-medium text-text-primary">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        id="edit-desc"
                                        rows={4}
                                        className={cn(
                                            "w-full bg-surface-input border border-transparent rounded-lg px-4 py-2.5 text-text-primary placeholder-text-muted transition-all duration-200",
                                            "focus:bg-surface-card focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
                                        )}
                                        placeholder="Add some more details about this task..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-6 py-2.5 font-medium text-text-secondary hover:text-text-primary hover:bg-slate-50 rounded-lg transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        isLoading={isSaving}
                                        icon={<Save size={18} />}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
