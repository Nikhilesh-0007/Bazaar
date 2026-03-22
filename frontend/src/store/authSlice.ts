import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '@/types';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null } as AuthState,
  reducers: {
    setCredentials(state, { payload }: PayloadAction<{ user: User; access_token: string }>) {
      state.user = payload.user;
      state.token = payload.access_token;
      if (typeof window !== 'undefined') localStorage.setItem('token', payload.access_token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
