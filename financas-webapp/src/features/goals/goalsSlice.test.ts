import { configureStore } from '@reduxjs/toolkit'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import goalsReducer, { createGoal, fetchGoals, selectGoalProgress } from './goalsSlice'
import transactionsReducer from '../transactions/transactionsSlice'
import authReducer from '../auth/authSlice'

const server = setupServer(
  http.get('/api/goals', () => {
    return HttpResponse.json([
      { id: 1, name: 'Viagem', targetAmount: 1000, deadline: '2026-12-31' },
    ])
  }),
  http.post('/api/goals', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 2, ...body })
  }),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(() => {
  server.resetHandlers()
})

describe('goalsSlice', () => {
  it('returns the initial state', () => {
    const state = goalsReducer(undefined, { type: 'unknown' })

    expect(state).toEqual({
      goals: [],
      loading: false,
      creating: false,
      error: null,
    })
  })

  it('loads goals from the API', async () => {
    const store = configureStore({
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
          transactions: [],
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
        goals: { goals: [], loading: false, creating: false, error: null },
      },
    })

    await store.dispatch(fetchGoals())

    expect(store.getState().goals.goals).toHaveLength(1)
    expect(store.getState().goals.goals[0].name).toBe('Viagem')
  })

  it('creates a goal through the API', async () => {
    const store = configureStore({
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
          transactions: [],
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
        goals: { goals: [], loading: false, creating: false, error: null },
      },
    })

    const result = await store.dispatch(
      createGoal({ name: 'Reserva', targetAmount: 500, deadline: '2026-11-01', category: 'Pessoal' }),
    )

    expect(result.type).toContain('fulfilled')
    expect(store.getState().goals.goals[0].name).toBe('Reserva')
  })
})

describe('goal progress selector', () => {
  it('returns 0 when there are no income transactions', () => {
    const store = configureStore({
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
          transactions: [],
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
          goals: [{ id: 1, name: 'Viagem', targetAmount: 1000, deadline: '2026-12-31' }],
          loading: false,
          creating: false,
          error: null,
        },
      },
    })

    const selector = selectGoalProgress(1)
    expect(selector(store.getState())).toBe(0)
  })

  it('returns the partial progress when income is lower than the goal', () => {
    const store = configureStore({
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
          transactions: [{ id: 1, amount: 300, type: 'INCOME', categoryId: 1, categoryName: 'Salario', date: '2026-08-01', description: 'salario', tag: null }],
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
          goals: [{ id: 1, name: 'Viagem', targetAmount: 1000, deadline: '2026-12-31' }],
          loading: false,
          creating: false,
          error: null,
        },
      },
    })

    const selector = selectGoalProgress(1)
    expect(selector(store.getState())).toBe(30)
  })

  it('returns 100% when income reaches the target', () => {
    const store = configureStore({
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
          transactions: [{ id: 1, amount: 1000, type: 'INCOME', categoryId: 1, categoryName: 'Salario', date: '2026-08-01', description: 'salario', tag: null }],
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
          goals: [{ id: 1, name: 'Viagem', targetAmount: 1000, deadline: '2026-12-31' }],
          loading: false,
          creating: false,
          error: null,
        },
      },
    })

    const selector = selectGoalProgress(1)
    expect(selector(store.getState())).toBe(100)
  })
})

