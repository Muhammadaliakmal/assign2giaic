'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: LucideIcon;
    error?: string;
}

export default function Input({ label, icon: Icon, error, className, id, ...props }: InputProps) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-text-primary">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                        <Icon size={20} strokeWidth={1.5} />
                    </div>
                )}
                <input
                    id={id}
                    className={cn(
                        "w-full bg-surface-input border border-transparent rounded-lg px-4 py-2.5 text-text-primary placeholder-text-muted transition-all duration-200",
                        "focus:bg-surface-card focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none",
                        Icon && "pl-10",
                        error && "border-status-error focus:border-status-error focus:ring-status-error/10",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-status-error flex items-center gap-1">
                    {error}
                </p>
            )}
        </div>
    );
}
