import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import NewGoalPage from '../../pages/NewGoalPage'
import goalsReducer from './goalsSlice'
import transactionsReducer from '../transactions/transactionsSlice'
import authReducer from '../auth/authSlice'

describe('NewGoalPage', () => {
  it('validates required fields', async () => {
    const user = userEvent.setup()
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

    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewGoalPage />
        </MemoryRouter>
      </Provider>,
    )

    await user.click(screen.getByRole('button', { name: /salvar meta/i }))

    expect(screen.getByText(/preencha nome, valor-alvo e data-limite/i)).toBeInTheDocument()
  })

  it('submits successfully with valid data', async () => {
    const user = userEvent.setup()
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

    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewGoalPage />
        </MemoryRouter>
      </Provider>,
    )

    await user.type(screen.getByLabelText(/nome da meta/i), 'Reserva de emergência')
    await user.type(screen.getByLabelText(/valor-alvo/i), '2500')
    await user.type(screen.getByLabelText(/data-limite/i), '2026-12-31')
    await user.type(screen.getByLabelText(/categoria/i), 'Pessoal')
    await user.click(screen.getByRole('button', { name: /salvar meta/i }))

    expect(screen.queryByText(/preencha nome, valor-alvo e data-limite/i)).not.toBeInTheDocument()
  })
})
