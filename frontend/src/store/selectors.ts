import { RootState } from '@/store';
import { CartItem } from '@/types';

export const selectCart = (state: RootState): CartItem[] => {
  const cart = state.cart as any;
  if (Array.isArray(cart)) return cart;
  // redux-persist stores as object with numeric keys + _persist key
  return Object.keys(cart)
    .filter(k => k !== '_persist' && !isNaN(Number(k)))
    .map(k => cart[k]) as CartItem[];
};

export const selectCartCount = (state: RootState): number =>
  selectCart(state).reduce((n, i) => n + i.qty, 0);

export const selectUser = (state: RootState) => (state.auth as any).user;
export const selectToken = (state: RootState) => (state.auth as any).token;
