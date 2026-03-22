'use client';
import { useState } from 'react';
import { Product } from '@/types';
import { COLORS, fmt, pct } from '@/lib/constants';
import { Badge, StarRating, Btn } from './ui';
import { useAppDispatch } from '@/hooks/redux';
import { addItem } from '@/store/cartSlice';

export function ProductCard({ product, onView }: { product: Product; onView: (p: Product) => void }) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);
  const discount = pct(product.price, product.mrp);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addItem(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div onClick={() => onView(product)}
      style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
      <div style={{ background: COLORS.surfaceAlt, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ fontSize: 72 }}>{product.image}</span>
        {product.badge && <div style={{ position: 'absolute', top: 12, left: 12 }}><Badge text={product.badge} /></div>}
        {discount > 0 && <div style={{ position: 'absolute', top: 12, right: 12 }}><Badge text={`${discount}% off`} color={COLORS.success} /></div>}
      </div>
      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>{product.category}</p>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: COLORS.text, lineHeight: 1.4 }}>{product.name}</h3>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>{fmt(product.price)}</span>
          <span style={{ fontSize: 13, color: COLORS.textMuted, textDecoration: 'line-through' }}>{fmt(product.mrp)}</span>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 12 }}>
          <Btn onClick={handleAdd} variant={added ? 'success' : 'primary'} style={{ width: '100%', justifyContent: 'center' }}>
            {added ? '✓ Added!' : 'Add to Cart'}
          </Btn>
        </div>
      </div>
    </div>
  );
}

export function ProductDetail({ product, onClose }: { product: Product; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(1);
  const discount = pct(product.price, product.mrp);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) dispatch(addItem(product));
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: COLORS.surface, borderRadius: 16, maxWidth: 700, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex' }}>
          <div style={{ background: COLORS.surfaceAlt, width: 280, minWidth: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100, borderRadius: '16px 0 0 16px', padding: 40 }}>{product.image}</div>
          <div style={{ padding: 32, flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Badge text={product.category} color={COLORS.info} />
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: COLORS.textMuted }}>✕</button>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '12px 0 8px' }}>{product.name}</h2>
            <StarRating rating={product.rating} reviews={product.reviews} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '16px 0' }}>
              <span style={{ fontSize: 28, fontWeight: 800 }}>{fmt(product.price)}</span>
              <span style={{ color: COLORS.textMuted, textDecoration: 'line-through' }}>{fmt(product.mrp)}</span>
              <Badge text={`${discount}% off`} color={COLORS.success} />
            </div>
            <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.7, margin: '0 0 20px' }}>{product.desc}</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, padding: 12, background: COLORS.surfaceAlt, borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: COLORS.textMuted }}>Stock:</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: product.stock > 10 ? COLORS.success : COLORS.warning }}>
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left!`}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: 'hidden' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '8px 14px', border: 'none', background: COLORS.surfaceAlt, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}>−</button>
                <span style={{ padding: '8px 16px', fontSize: 14, fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ padding: '8px 14px', border: 'none', background: COLORS.surfaceAlt, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}>+</button>
              </div>
              <Btn onClick={handleAdd} style={{ flex: 1, justifyContent: 'center' }}>
                Add {qty} to Cart — {fmt(product.price * qty)}
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
