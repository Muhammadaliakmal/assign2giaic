'use client';

import React, { useState } from 'react';
import { Plus, Calendar, Flag, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TaskInputProps {
    onAdd: (title: string, description: string) => Promise<void>;
}

export default function TaskInput({ onAdd }: TaskInputProps) {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || loading) return;

        setLoading(true);
        try {
            await onAdd(title, '');
            setTitle('');
            setIsExpanded(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className={cn(
                "bg-white rounded-xl border border-slate-200 transition-all duration-300",
                isExpanded ? "shadow-floating ring-2 ring-primary-500/10 scale-[1.02]" : "shadow-card"
            )}
        >
            <form onSubmit={handleSubmit} className="p-2">
                <div className="flex items-center gap-3 px-3 py-1">
                    <Plus className="text-text-muted" size={24} />
                    <input
                        type="text"
                        placeholder="Add a new task..."
                        className="w-full bg-transparent border-none focus:ring-0 text-text-primary placeholder-text-muted text-[15px] py-3"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                    />
                </div>

                {isExpanded && (
                    <div className="flex items-center justify-end mt-2 pt-2 border-t border-slate-100 px-3 pb-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2">
                            <button 
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                            >
                                Cancel
                            </button>
                            <Button
                                type="submit"
                                className="py-1.5 px-6 h-auto w-auto text-sm"
                                disabled={!title.trim()}
                                isLoading={loading}
                            >
                                Create Task
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
