import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import transactionsReducer from '../features/transactions/transactionsSlice'
import goalsReducer from '../features/goals/goalsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    goals: goalsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
