import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    300: '#A5B4FC',
                    400: '#818CF8',
                    500: '#6366F1',
                    600: '#4F46E5', // Main
                    700: '#4338CA', // Hover
                    800: '#3730A3',
                    900: '#312E81',
                    950: '#1E1B4B',
                },
                surface: {
                    background: '#F9FAFB',
                    card: '#FFFFFF',
                    input: '#F3F4F6',
                },
                text: {
                    primary: '#111827',
                    secondary: '#6B7280',
                    muted: '#9CA3AF',
                },
                status: {
                    error: '#EF4444',
                    success: '#10B981',
                },
                task_states: {
                    pending_bg: '#FFFFFF',
                    completed_bg: '#F9FAFB',
                    completed_text: '#9CA3AF',
                    hover_row: '#F3F4F6'
                },
                priority: {
                    high: { bg: '#FEF2F2', text: '#EF4444' },
                    medium: { bg: '#FFFBEB', text: '#F59E0B' },
                    low: { bg: '#EFF6FF', text: '#3B82F6' }
                },
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'glow': '0 0 20px rgba(79, 70, 229, 0.3)',
                'glow-primary': '0 0 20px rgba(99, 102, 241, 0.3)',
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'floating': '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
