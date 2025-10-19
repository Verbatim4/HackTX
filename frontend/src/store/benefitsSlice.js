import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  currentCategory: null,
  benefits: [],
  calculationResult: null,
  loading: false,
  error: null,
}

// Get benefits by category
export const getBenefitsByCategory = createAsyncThunk(
  'benefits/getByCategory',
  async (category, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await axios.get(`/api/benefits/${category}`, config)
      return { category, benefits: response.data }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

// Calculate benefit
export const calculateBenefit = createAsyncThunk(
  'benefits/calculate',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await axios.post('/api/benefits/calculate', data, config)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

const benefitsSlice = createSlice({
  name: 'benefits',
  initialState,
  reducers: {
    clearCalculation: (state) => {
      state.calculationResult = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBenefitsByCategory.pending, (state) => {
        state.loading = true
      })
      .addCase(getBenefitsByCategory.fulfilled, (state, action) => {
        state.loading = false
        state.currentCategory = action.payload.category
        state.benefits = action.payload.benefits
      })
      .addCase(getBenefitsByCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(calculateBenefit.pending, (state) => {
        state.loading = true
      })
      .addCase(calculateBenefit.fulfilled, (state, action) => {
        state.loading = false
        state.calculationResult = action.payload
      })
      .addCase(calculateBenefit.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCalculation } = benefitsSlice.actions
export default benefitsSlice.reducer

