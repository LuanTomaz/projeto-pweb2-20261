import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import GoalsPage from '../../pages/GoalsPage'
import goalsReducer from './goalsSlice'
import transactionsReducer from '../transactions/transactionsSlice'
import authReducer from '../auth/authSlice'

describe('GoalsPage', () => {
  it('renders goals from fixtures', async () => {
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
          goals: [{ id: 1, name: 'Viagem', targetAmount: 1000, deadline: '2026-12-31', category: 'Lazer' }],
          loading: false,
          creating: false,
          error: null,
        },
      },
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <GoalsPage />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Viagem')).toBeInTheDocument()
    })
    expect(screen.getByText(/Meta de/i)).toBeInTheDocument()
  })
})
