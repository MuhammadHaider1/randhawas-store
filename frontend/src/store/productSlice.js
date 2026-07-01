import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params) => {
  const { data } = await api.get('/products/', { params }); return data
})
export const fetchProduct = createAsyncThunk('products/fetchProduct', async (slug) => {
  const { data } = await api.get(`/products/${slug}/`); return data
})
export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const { data } = await api.get('/products/categories/'); return data
})
export const fetchFeatured = createAsyncThunk('products/fetchFeatured', async () => {
  const { data } = await api.get('/products/featured/'); return data
})
export const fetchComingSoon = createAsyncThunk('products/fetchComingSoon', async () => {
  const { data } = await api.get('/products/coming-soon/'); return data
})

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], featured: [], comingSoon: [], categories: [], current: null, total: 0, loading: false, error: null },
  reducers: {
    clearCurrent(state) { state.current = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.loading = false; state.items = payload.results || payload; state.total = payload.count || payload.length
      })
      .addCase(fetchProducts.rejected, (state, { error }) => { state.loading = false; state.error = error.message })
      .addCase(fetchProduct.fulfilled, (state, { payload }) => { state.current = payload })
      .addCase(fetchFeatured.fulfilled, (state, { payload }) => { state.featured = payload.results || payload })
      .addCase(fetchComingSoon.fulfilled, (state, { payload }) => { state.comingSoon = payload.results || payload })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => { state.categories = payload })
  },
})

export const { clearCurrent } = productSlice.actions
export default productSlice.reducer
