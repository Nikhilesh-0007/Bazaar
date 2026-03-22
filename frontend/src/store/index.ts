'use client';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import cartReducer from './cartSlice';
import authReducer from './authSlice';

const createNoopStorage = () => ({
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, value: any) => Promise.resolve(value),
  removeItem: (_key: string) => Promise.resolve(),
});

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const cartPersist = persistReducer({ key: 'cart', storage }, cartReducer);
const authPersist = persistReducer({ key: 'auth', storage }, authReducer);

export const store = configureStore({
  reducer: { cart: cartPersist, auth: authPersist },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState> & {
  cart: import('./cartSlice').CartItem[];
  auth: { user: import('../types').User | null; token: string | null };
};
export type AppDispatch = typeof store.dispatch;
