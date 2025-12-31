'use client';

import React from 'react';
import { 
    LayoutDashboard, 
    Calendar, 
    CheckCircle2, 
    Star, 
    Settings, 
    LogOut,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: LayoutDashboard, label: 'All Tasks', id: 'all' },
    { icon: CheckCircle2, label: 'Completed', id: 'completed' },
];

export default function Sidebar({ activeFilter, onFilterChange }: { activeFilter: string, onFilterChange: (id: string) => void }) {
    const { logout, user } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-display font-bold text-text-primary">TaskFlow</span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onFilterChange(item.id)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group",
                                activeFilter === item.id 
                                    ? "bg-primary-50 text-primary-600" 
                                    : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} strokeWidth={activeFilter === item.id ? 2 : 1.5} />
                                <span className="font-medium text-[15px]">{item.label}</span>
                            </div>
                            {activeFilter === item.id && (
                                <ChevronRight size={16} />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold uppercase">
                        {user?.username?.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-text-primary">{user?.username}</span>
                        <span className="text-xs text-text-muted">Free Plan</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-slate-50 hover:text-text-primary rounded-lg transition-colors">
                        <Settings size={20} />
                        <span className="text-[15px]">Settings</span>
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-status-error hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="text-[15px]">Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
