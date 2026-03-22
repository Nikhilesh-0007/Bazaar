'use client';
import { CSSProperties } from 'react';
import { COLORS } from '@/lib/constants';

export const Badge = ({ text, color = COLORS.brandAccent }: { text: string; color?: string }) => (
  <span style={{ background: color + '20', color, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{text}</span>
);

export const StatusBadge = ({ status }: { status: string }) => {
  const cfg: Record<string, { bg: string; color: string }> = {
    DELIVERED: { bg: '#D1FAE5', color: '#065F46' },
    SHIPPED: { bg: '#DBEAFE', color: '#1E40AF' },
    PROCESSING: { bg: '#FEF3C7', color: '#92400E' },
    PENDING: { bg: '#FEE2E2', color: '#991B1B' },
    CANCELLED: { bg: '#F3F4F6', color: '#374151' },
  };
  const s = cfg[status] || { bg: '#F3F4F6', color: '#374151' };
  return <span style={{ background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>{status}</span>;
};

export const StarRating = ({ rating, reviews }: { rating: number; reviews: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <span style={{ color: '#F59E0B', fontSize: 13 }}>{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.ceil(rating))}</span>
    <span style={{ fontSize: 12, color: COLORS.textMuted }}>{rating} ({reviews?.toLocaleString()})</span>
  </div>
);

interface BtnProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: CSSProperties;
  type?: 'button' | 'submit';
}

export const Btn = ({ children, onClick, variant = 'primary', size = 'md', disabled, style = {}, type = 'button' }: BtnProps) => {
  const sizes = { sm: { padding: '6px 14px', fontSize: 13 }, md: { padding: '10px 20px', fontSize: 14 }, lg: { padding: '14px 28px', fontSize: 16 } };
  const variants = {
    primary: { background: COLORS.brandAccent, color: '#fff', border: 'none' },
    secondary: { background: COLORS.surfaceAlt, color: COLORS.text, border: `1px solid ${COLORS.border}` },
    danger: { background: COLORS.danger, color: '#fff', border: 'none' },
    ghost: { background: 'transparent', color: COLORS.textMuted, border: `1px solid ${COLORS.border}` },
    success: { background: COLORS.success, color: '#fff', border: 'none' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer', borderRadius: 8, fontWeight: 600, transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: disabled ? 0.5 : 1, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

export const Input = ({ placeholder, value, onChange, type = 'text', style = {} }: { placeholder: string; value: string; onChange: (v: string) => void; type?: string; style?: CSSProperties }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
    style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 14, width: '100%', boxSizing: 'border-box', outline: 'none', color: COLORS.text, background: COLORS.surface, ...style }} />
);

export const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 14, background: COLORS.surface, color: COLORS.text, cursor: 'pointer', outline: 'none' }}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);
