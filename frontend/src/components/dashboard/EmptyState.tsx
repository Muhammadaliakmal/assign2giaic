'use client';

import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState() {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
        >
            <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-600 mb-6">
                <ClipboardCheck size={40} />
            </div>
            <h3 className="text-xl font-display font-bold text-text-primary mb-2">
                All caught up!
            </h3>
            <p className="text-text-secondary max-w-sm mx-auto">
                No tasks found for this filter. Start your day by adding a new goal or take a well-deserved break.
            </p>
        </motion.div>
    );
}
