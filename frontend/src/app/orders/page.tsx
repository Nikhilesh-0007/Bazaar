'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COLORS, fmt } from '@/lib/constants';
import { StatusBadge, Btn } from '@/components/ui';
import { useAppSelector } from '@/hooks/redux';
import { selectUser } from '@/store/selectors';
import { api } from '@/lib/api';
import { Order } from '@/types';

export default function OrdersPage() {
  const user = useAppSelector(selectUser);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.orders.mine().then(setOrders).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Sign in to view orders</h2>
      <Link href="/auth"><Btn style={{ marginTop: 8 }}>Sign In</Btn></Link>
    </div>
  );

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}>Loading orders...</div>;

  if (orders.length === 0) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No orders yet</h2>
      <Link href="/products"><Btn style={{ marginTop: 8 }}>Start Shopping</Btn></Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>My Orders</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map(order => (
          <div key={order.id} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 16 }}>Order #{order.id.slice(-8).toUpperCase()}</p>
                <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted }}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {order.items.length} item(s)
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: 14 }}>{order.items.map(i => `${i.product.image} ${i.product.name}`).join(', ')}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontWeight: 700 }}>{fmt(order.total)}</span>
                <Btn variant="ghost" size="sm">Track</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
