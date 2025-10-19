import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  profile: null,
  accessibility: {
    fontSize: 'medium',
    colorFilter: 'none',
    dyslexiaFont: false,
    highContrast: false,
    narrationEnabled: false,
  },
  loading: false,
  error: null,
}

// Get user profile
export const getUserProfile = createAsyncThunk('user/getProfile', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await axios.get('/api/user/profile', config)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await axios.put('/api/user/profile', userData, config)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessibility: (state, action) => {
      state.accessibility = { ...state.accessibility, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
        state.accessibility = action.payload.accessibility || state.accessibility
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload
        state.accessibility = action.payload.accessibility || state.accessibility
      })
  },
})

export const { setAccessibility } = userSlice.actions
export default userSlice.reducer

