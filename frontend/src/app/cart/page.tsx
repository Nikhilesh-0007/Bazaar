'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { COLORS, fmt } from '@/lib/constants';
import { Btn } from '@/components/ui';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { removeItem, updateQty } from '@/store/cartSlice';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(s => Array.isArray(s.cart) ? s.cart : []);
  const user = useAppSelector(s => s.auth.user);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal > 499 ? 0 : 49;
  const total = subtotal + delivery;

  if (cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: 100 }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🛒</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Your cart is empty</h2>
      <p style={{ color: COLORS.textMuted, marginBottom: 24 }}>Add items to get started</p>
      <Link href="/products"><Btn>Browse Products</Btn></Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Shopping Cart ({cart.length} items)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cart.map(item => (
            <div key={item.id} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 80, height: 80, background: COLORS.surfaceAlt, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{item.image}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 15 }}>{item.name}</p>
                <p style={{ margin: '0 0 8px', fontSize: 13, color: COLORS.textMuted }}>{item.category}</p>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{fmt(item.price)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.surfaceAlt, cursor: 'pointer', fontSize: 16 }}>−</button>
                <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                <button onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.surfaceAlt, cursor: 'pointer', fontSize: 16 }}>+</button>
              </div>
              <div style={{ textAlign: 'right', minWidth: 90 }}>
                <p style={{ margin: '0 0 8px', fontWeight: 700 }}>{fmt(item.price * item.qty)}</p>
                <button onClick={() => dispatch(removeItem(item.id))} style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, position: 'sticky', top: 80 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: COLORS.textMuted }}>Subtotal</span><span>{fmt(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: COLORS.textMuted }}>Delivery</span>
            <span style={{ color: delivery === 0 ? COLORS.success : COLORS.text }}>{delivery === 0 ? 'FREE' : fmt(delivery)}</span>
          </div>
          <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
            <span>Total</span><span>{fmt(total)}</span>
          </div>
        </div>
        <Btn onClick={() => router.push(user ? '/checkout' : '/auth')} style={{ width: '100%', justifyContent: 'center' }} size="lg">
          {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
        </Btn>
        <Link href="/products">
          <Btn variant="ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} size="sm">Continue Shopping</Btn>
        </Link>
      </div>
    </div>
  );
}
