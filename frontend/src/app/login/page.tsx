'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import AuthLayout from '@/components/layout/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          icon={Mail}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="space-y-1">
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <div className="flex justify-end">
            <Link 
              href="#" 
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-status-error/20 rounded-lg text-status-error text-sm font-medium flex items-center gap-2"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-status-error" />
                {error}
            </motion.div>
        )}

        <Button 
            type="submit" 
            isLoading={loading}
            icon={<LogIn size={18} />}
        >
            Sign In
        </Button>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface-background text-text-muted">
                    Or continue with
                </span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Button type="button" variant="outline">
                Google
            </Button>
            <Button type="button" variant="outline">
                GitHub
            </Button>
        </div>

        <p className="text-center text-sm text-text-secondary mt-8">
            Don't have an account?{' '}
            <Link 
                href="/signup" 
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
                Sign up
            </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
