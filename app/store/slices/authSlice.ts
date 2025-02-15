import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

export const initiateAuth = createAsyncThunk(
  'auth/initiate',
  async () => {
    const requestToken = await authService.createRequestToken();
    const authURL = authService.getAuthURL(requestToken);
    window.location.href = authURL;
    return requestToken;
  }
);

export const completeAuth = createAsyncThunk(
  'auth/complete',
  async (requestToken: string) => {
    const sessionId = await authService.createSession(requestToken);
    const account = await authService.getAccount(sessionId);
    return { sessionId, account };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    sessionId: localStorage.getItem('session_id'),
    account: null,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.sessionId = null;
      state.account = null;
      localStorage.removeItem('session_id');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(completeAuth.fulfilled, (state, action) => {
        state.sessionId = action.payload.sessionId;
        state.account = action.payload.account;
        state.loading = false;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
