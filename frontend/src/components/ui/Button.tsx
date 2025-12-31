'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export default function Button({ 
    children, 
    variant = 'primary', 
    isLoading, 
    icon,
    className, 
    disabled,
    ...props 
}: ButtonProps) {
    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20 active:scale-[0.98]",
        outline: "border-2 border-slate-200 text-text-primary hover:bg-surface-input hover:border-slate-300",
        ghost: "text-primary-600 hover:bg-primary-50 hover:text-primary-700",
    };

    return (
        <button
            disabled={isLoading || disabled}
            className={cn(
                "w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-medium transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                variants[variant],
                className
            )}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
            ) : icon ? (
                <span className="flex items-center gap-2">{icon}{children}</span>
            ) : (
                children
            )}
        </button>
    );
}
