'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full flex bg-surface-background">
            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-primary-600 relative overflow-hidden items-center justify-center p-12">
                {/* Abstract Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 text-white max-w-lg"
                >
                    <h1 className="text-5xl font-bold font-display mb-6">TaskFlow Pro</h1>
                    <p className="text-xl text-primary-100 leading-relaxed">
                        Master your productivity with our premium task management solution. 
                        Designed for professionals who value efficiency and aesthetics.
                    </p>
                </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold font-display text-text-primary mb-2">
                            {title}
                        </h2>
                        <p className="text-text-secondary">
                            {description}
                        </p>
                    </div>

                    {children}
                </motion.div>
            </div>
        </div>
    );
}
