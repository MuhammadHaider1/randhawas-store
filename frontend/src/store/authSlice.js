import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

export const login = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login/', creds)
    localStorage.setItem('access', data.access); localStorage.setItem('refresh', data.refresh)
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.error || 'Login failed') }
})

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register/', userData)
    localStorage.setItem('access', data.access); localStorage.setItem('refresh', data.refresh)
    return data
  } catch (err) {
    const errData = err.response?.data
    let msg = 'Registration failed'
    if (typeof errData === 'object') {
      const first = Object.values(errData)[0]
      msg = Array.isArray(first) ? first[0] : String(first)
    } else if (typeof errData === 'string') {
      msg = errData
    }
    return rejectWithValue(msg)
  }
})

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/auth/me/'); return data }
  catch { return rejectWithValue('Not authenticated') }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, isAuthenticated: !!localStorage.getItem('access') },
  reducers: {
    logout(state) {
      state.user = null; state.isAuthenticated = false
      localStorage.removeItem('access'); localStorage.removeItem('refresh')
    },
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, { payload }) => { state.loading = false; state.user = payload.user; state.isAuthenticated = true })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.rejected, (state, { payload }) => { state.loading = false; state.error = payload })
      .addCase(register.fulfilled, (state, { payload }) => { state.loading = false; state.user = payload.user; state.isAuthenticated = true })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null })
      .addCase(register.rejected, (state, { payload }) => { state.loading = false; state.error = payload })
      .addCase(fetchMe.fulfilled, (state, { payload }) => { state.user = payload; state.isAuthenticated = true })
      .addCase(fetchMe.rejected, (state) => { state.user = null; state.isAuthenticated = false })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
