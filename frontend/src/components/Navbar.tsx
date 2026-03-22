'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { COLORS } from '@/lib/constants';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/authSlice';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const cartCount = useAppSelector(s => Array.isArray(s.cart) ? s.cart.reduce((n, i) => n + i.qty, 0) : 0);

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/orders', label: 'My Orders' },
  ];

  return (
    <nav style={{ background: COLORS.brand, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 24, height: 60, position: 'sticky', top: 0, zIndex: 900, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <Link href="/" style={{ color: '#fff', fontWeight: 900, fontSize: 20, textDecoration: 'none', letterSpacing: -0.5 }}>
        <span style={{ color: COLORS.brandAccent }}>BAZAAR</span>
      </Link>

      <div style={{ flex: 1, display: 'flex', gap: 4 }}>
        {nav.map(({ href, label }) => (
          <Link key={href} href={href} style={{ background: pathname === href ? 'rgba(255,255,255,0.1)' : 'transparent', color: pathname === href ? '#fff' : 'rgba(255,255,255,0.6)', padding: '8px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            {label}
          </Link>
        ))}
        {user?.role === 'ADMIN' && (
          <Link href="/admin" style={{ background: pathname === '/admin' ? COLORS.brandAccent + '30' : 'transparent', color: COLORS.brandAccent, padding: '8px 14px', borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Admin ✦
          </Link>
        )}
      </div>

      <Link href="/cart" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        🛒 Cart
        {cartCount > 0 && (
          <span style={{ background: COLORS.brandAccent, color: '#fff', width: 20, height: 20, borderRadius: '50%', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
        )}
      </Link>

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: COLORS.brandAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
            {user.name[0]}
          </div>
          <button onClick={() => { dispatch(logout()); router.push('/'); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 12 }}>Logout</button>
        </div>
      ) : (
        <Link href="/auth" style={{ background: COLORS.brandAccent, color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
      )}
    </nav>
  );
}
