import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import limitsReducer from '../features/limits/limitsSlice'
import transactionsReducer from '../features/transactions/transactionsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    limits: limitsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
