import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '@/types';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [] as CartItem[],
  reducers: {
    addItem(state, { payload }: PayloadAction<Product>) {
      const item = state.find(i => i.id === payload.id);
      if (item) item.qty += 1;
      else state.push({ ...payload, qty: 1 });
    },
    removeItem(state, { payload }: PayloadAction<string>) {
      return state.filter(i => i.id !== payload);
    },
    updateQty(state, { payload }: PayloadAction<{ id: string; qty: number }>) {
      const item = state.find(i => i.id === payload.id);
      if (item) item.qty = Math.max(1, payload.qty);
    },
    clearCart: () => [],
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
