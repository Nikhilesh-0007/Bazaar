'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { COLORS, fmt } from '@/lib/constants';
import { StatusBadge, Btn, Select } from '@/components/ui';
import { useAppSelector } from '@/hooks/redux';
import { selectUser } from '@/store/selectors';
import { api } from '@/lib/api';

export default function AdminPage() {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const [tab, setTab] = useState<'analytics' | 'orders' | 'products'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) { router.push('/auth'); return; }
    if (user.role !== 'ADMIN') { router.push('/'); return; }
    api.orders.analytics().then(setAnalytics).catch(() => {});
    api.orders.all().then(r => setOrders(r.orders)).catch(() => {});
    api.products.list({ limit: '50' }).then(r => setProducts(r.products)).catch(() => {});
  }, [user]);

  if (!user || user.role !== 'ADMIN') return null;

  const statCards = analytics ? [
    { label: 'Total Revenue', value: fmt(analytics.totalRevenue), icon: '💰' },
    { label: 'Total Orders', value: analytics.totalOrders.toLocaleString(), icon: '📦' },
    { label: 'Total Users', value: analytics.totalUsers.toLocaleString(), icon: '👥' },
    { label: 'Avg Order Value', value: fmt(analytics.avgOrderValue), icon: '📊' },
  ] : [];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['analytics', 'orders', 'products'] as const).map(t => (
            <Btn key={t} variant={tab === t ? 'primary' : 'ghost'} size="sm" onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</Btn>
          ))}
        </div>
      </div>

      {tab === 'analytics' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            {statCards.map(s => (
              <div key={s.label} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <p style={{ margin: '0 0 4px', fontSize: 13, color: COLORS.textMuted }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.surfaceAlt }}>
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>#{order.id.slice(-8).toUpperCase()}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{order.user?.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{order.items?.length}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{fmt(order.total)}</td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={order.status} /></td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: COLORS.textMuted }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Select value={order.status} onChange={v => api.orders.updateStatus(order.id, v).then(() => setOrders(os => os.map(o => o.id === order.id ? { ...o, status: v } : o)))}
                      options={['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'products' && (
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.surfaceAlt }}>
                {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.image} {p.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: COLORS.textMuted }}>{p.category}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{fmt(p.price)}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: p.stock < 10 ? COLORS.warning : COLORS.success, fontWeight: 600 }}>{p.stock}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>⭐ {p.rating}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Btn variant="danger" size="sm" onClick={() => api.products.remove(p.id).then(() => setProducts(ps => ps.filter(x => x.id !== p.id)))}>Remove</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
