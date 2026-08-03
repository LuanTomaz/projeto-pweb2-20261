import { describe, expect, it } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import goalsReducer, { selectGoalProgress } from './goalsSlice'
import transactionsReducer from '../transactions/transactionsSlice'
import authReducer from '../auth/authSlice'

describe('goal selectors', () => {
  function createStore(transactions: Array<any>, goalTargetAmount: number) {
    return configureStore({
      reducer: {
        auth: authReducer,
        transactions: transactionsReducer,
        goals: goalsReducer,
      },
      preloadedState: {
        auth: { user: null, token: 'token', loading: false, error: null },
        transactions: {
          categories: [],
          categoriesLoading: false,
          transactions,
          selectedTransaction: null,
          page: 0,
          pageSize: 10,
          totalPages: 0,
          totalElements: 0,
          loading: false,
          creating: false,
          updating: false,
          deletingId: null,
          error: null,
        },
        goals: {
          goals: [{ id: 1, name: 'Meta', targetAmount: goalTargetAmount, deadline: '2026-12-31' }],
          loading: false,
          creating: false,
          error: null,
        },
      },
    })
  }

  it('returns 0 when there are no income transactions', () => {
    const store = createStore([], 1000)
    expect(selectGoalProgress(1)(store.getState())).toBe(0)
  })

  it('returns partial progress when there is some income', () => {
    const store = createStore([
      { id: 1, amount: 400, type: 'INCOME', categoryId: 1, categoryName: 'Salario', date: '2026-08-01', description: 'salario', tag: null },
    ], 1000)

    expect(selectGoalProgress(1)(store.getState())).toBe(40)
  })

  it('returns 100 when income reaches the target', () => {
    const store = createStore([
      { id: 1, amount: 1000, type: 'INCOME', categoryId: 1, categoryName: 'Salario', date: '2026-08-01', description: 'salario', tag: null },
    ], 1000)

    expect(selectGoalProgress(1)(store.getState())).toBe(100)
  })
})
