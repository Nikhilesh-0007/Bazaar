'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/hooks/redux';
import { setCredentials } from '@/store/authSlice';
import { api } from '@/lib/api';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { router.push('/auth'); return; }
    localStorage.setItem('token', token);
    api.auth.me().then(user => {
      dispatch(setCredentials({ user, access_token: token }));
      router.push('/');
    }).catch(() => router.push('/auth'));
  }, []);

  return <div style={{ textAlign: 'center', padding: 80 }}>Signing you in...</div>;
}
