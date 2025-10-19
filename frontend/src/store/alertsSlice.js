import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  alerts: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

// Get alerts
export const getAlerts = createAsyncThunk('alerts/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await axios.get('/api/alerts', config)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

// Mark alert as viewed
export const markAlertViewed = createAsyncThunk(
  'alerts/markViewed',
  async (alertId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await axios.put(`/api/alerts/${alertId}/viewed`, {}, config)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAlerts.pending, (state) => {
        state.loading = true
      })
      .addCase(getAlerts.fulfilled, (state, action) => {
        state.loading = false
        state.alerts = action.payload
        state.unreadCount = action.payload.filter((a) => !a.viewed).length
      })
      .addCase(getAlerts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(markAlertViewed.fulfilled, (state, action) => {
        const index = state.alerts.findIndex((a) => a._id === action.payload._id)
        if (index !== -1) {
          state.alerts[index] = action.payload
          state.unreadCount = state.alerts.filter((a) => !a.viewed).length
        }
      })
  },
})

export default alertsSlice.reducer

