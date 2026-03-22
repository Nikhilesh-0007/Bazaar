'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { COLORS, fmt } from '@/lib/constants';
import { Input, Select } from '@/components/ui';
import { ProductCard, ProductDetail } from '@/components/ProductCard';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('Popular');
  const [priceMax, setPriceMax] = useState(150000);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { sort, priceMax: String(priceMax) };
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const data = await api.products.list(params);
      setProducts(data.products);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [category, sort, priceMax, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { api.products.categories().then(setCategories).catch(() => {}); }, []);

  return (
    <div style={{ display: 'flex', maxWidth: 1200, margin: '0 auto', padding: 24, gap: 24 }}>
      {viewProduct && <ProductDetail product={viewProduct} onClose={() => setViewProduct(null)} />}

      {/* Sidebar */}
      <aside style={{ width: 220, minWidth: 220, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, height: 'fit-content', position: 'sticky', top: 80 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Filters</h3>
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</p>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', background: category === c ? COLORS.brandLight : 'none', color: category === c ? COLORS.brandAccent : COLORS.text, border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: category === c ? 600 : 400, marginBottom: 2 }}>
              {c}
            </button>
          ))}
        </div>
        <div>
          <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Price</p>
          <input type="range" min={100} max={150000} step={500} value={priceMax} onChange={e => setPriceMax(+e.target.value)} style={{ width: '100%' }} />
          <p style={{ fontSize: 14, fontWeight: 600, margin: '8px 0 0' }}>{fmt(priceMax)}</p>
        </div>
      </aside>

      {/* Grid */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <Input placeholder="Search products..." value={search} onChange={setSearch} style={{ flex: 1, minWidth: 200 }} />
          <Select value={sort} onChange={setSort} options={['Popular', 'Rating', 'Price ↑', 'Price ↓']} />
          <span style={{ fontSize: 13, color: COLORS.textMuted }}>{total} results</span>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: COLORS.textMuted }}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: COLORS.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 16, fontWeight: 600 }}>No products found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {products.map(p => <ProductCard key={p.id} product={p} onView={setViewProduct} />)}
          </div>
        )}
      </div>
    </div>
  );
}
