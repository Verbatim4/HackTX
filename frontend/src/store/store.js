import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import userReducer from './userSlice'
import benefitsReducer from './benefitsSlice'
import alertsReducer from './alertsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    benefits: benefitsReducer,
    alerts: alertsReducer,
  },
})

