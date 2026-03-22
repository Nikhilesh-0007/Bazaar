'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { COLORS } from '@/lib/constants';
import { Btn, Input } from '@/components/ui';
import { api } from '@/lib/api';
import { useAppDispatch } from '@/hooks/redux';
import { setCredentials } from '@/store/authSlice';

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      const result = mode === 'login'
        ? await api.auth.login({ email: form.email, password: form.password })
        : await api.auth.register(form);
      dispatch(setCredentials(result));
      router.push('/');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 40, width: '100%', maxWidth: 420 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p style={{ color: COLORS.textMuted, textAlign: 'center', marginBottom: 28, fontSize: 14 }}>
          {mode === 'login' ? 'Sign in to your Bazaar account' : 'Join Bazaar today'}
        </p>

        {/* Google OAuth */}
        <a href={api.auth.googleUrl()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '10px 20px', border: `1px solid ${COLORS.border}`, borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 600, color: COLORS.text, textDecoration: 'none' }}>
          <span>🔵</span> Continue with Google
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: COLORS.border }} />
          <span style={{ fontSize: 12, color: COLORS.textMuted }}>or</span>
          <div style={{ flex: 1, height: 1, background: COLORS.border }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'register' && <Input placeholder="Full Name" value={form.name} onChange={set('name')} />}
          <Input placeholder="Email address" value={form.email} onChange={set('email')} type="email" />
          <Input placeholder="Password" value={form.password} onChange={set('password')} type="password" />
        </div>

        {error && <p style={{ color: COLORS.danger, fontSize: 13, marginTop: 12 }}>{error}</p>}

        <Btn onClick={submit} disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} size="lg">
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </Btn>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: COLORS.textMuted }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ background: 'none', border: 'none', color: COLORS.brandAccent, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
