'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import AuthLayout from '@/components/layout/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      description="Join us to start managing your tasks efficiently"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="username"
          type="text"
          label="Username"
          placeholder="johndoe"
          icon={User}
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />

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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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

            <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            />
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
            icon={<UserPlus size={18} />}
        >
            Create Account
        </Button>

        <p className="text-center text-sm text-text-secondary mt-8">
            Already have an account?{' '}
            <Link 
                href="/login" 
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
                Sign in
            </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
