'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COLORS, fmt, pct } from '@/lib/constants';
import { Badge, Btn } from '@/components/ui';
import { ProductCard, ProductDetail } from '@/components/ProductCard';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    api.products.list({ limit: '3' }).then(r => setFeatured(r.products)).catch(() => {});
  }, []);

  const categories = [
    { name: 'Electronics', icon: '💻', color: '#EFF6FF' },
    { name: 'Fashion', icon: '👗', color: '#FFF1F2' },
    { name: 'Home & Kitchen', icon: '🏠', color: '#F0FDF4' },
    { name: 'Books', icon: '📚', color: '#FFFBEB' },
    { name: 'Sports', icon: '⚽', color: '#F0F9FF' },
  ];

  return (
    <div>
      {viewProduct && <ProductDetail product={viewProduct} onClose={() => setViewProduct(null)} />}

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.brand} 0%, #1a2535 100%)`, padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: COLORS.brandAccent + '15' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Badge text="🔥 MEGA SALE — Up to 70% Off" color={COLORS.brandAccent} />
          <h1 style={{ color: '#fff', fontSize: 48, fontWeight: 900, margin: '20px 0 12px', letterSpacing: -1.5, lineHeight: 1.1 }}>
            Everything You Need,<br /><span style={{ color: COLORS.brandAccent }}>Delivered Fast.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, margin: '0 0 32px' }}>12,000+ products across 50+ categories. Free delivery on orders over ₹499.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/products"><Btn size="lg">Shop Now →</Btn></Link>
            <Btn variant="ghost" size="lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>View Deals</Btn>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Shop by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {categories.map(cat => (
            <Link key={cat.name} href={`/products?category=${cat.name}`}
              style={{ background: cat.color, borderRadius: 12, padding: '20px 16px', textAlign: 'center', border: `1px solid ${COLORS.border}`, display: 'block' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{cat.icon}</div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: COLORS.text }}>{cat.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <div style={{ padding: '0 24px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Best Sellers</h2>
          <Link href="/products"><Btn variant="ghost" size="sm">View All →</Btn></Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {featured.map(p => <ProductCard key={p.id} product={p} onView={setViewProduct} />)}
        </div>
      </div>

      {/* Trust Bar */}
      <div style={{ background: COLORS.brand, padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, textAlign: 'center' }}>
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹499' },
            { icon: '🔒', title: 'Secure Payment', desc: '100% protected checkout' },
            { icon: '↩️', title: 'Easy Returns', desc: '10-day hassle-free returns' },
            { icon: '🎧', title: '24/7 Support', desc: 'Dedicated customer care' },
          ].map(t => (
            <div key={t.title}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
              <p style={{ color: '#fff', fontWeight: 600, margin: '0 0 4px', fontSize: 14 }}>{t.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: 12 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
