export const COLORS = {
  brand: '#0D1117',
  brandAccent: '#F97316',
  brandLight: '#FFF7ED',
  surface: '#FFFFFF',
  surfaceAlt: '#F8F9FA',
  border: '#E5E7EB',
  text: '#0D1117',
  textMuted: '#6B7280',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

export const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
export const pct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);
export const stars = (r: number) =>
  '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(r));
