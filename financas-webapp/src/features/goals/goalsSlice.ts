import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Transaction } from '../transactions/transactionsSlice'

const API_URL = '/api'

export interface Goal {
  id: number
  name: string
  targetAmount: number
  deadline: string
  category?: string
  createdAt?: string
}

interface GoalsState {
  goals: Goal[]
  loading: boolean
  creating: boolean
  error: string | null
}

const initialState: GoalsState = {
  goals: [],
  loading: false,
  creating: false,
  error: null,
}

async function readError(response: Response, fallback: string) {
  try {
    const data = await response.json()
    return data.message || fallback
  } catch {
    return fallback
  }
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export const fetchGoals = createAsyncThunk<
  Goal[],
  void,
  { state: RootState; rejectValue: string }
>('goals/fetchGoals', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  if (!token) {
    return rejectWithValue('Sessao expirada. Faca login novamente.')
  }

  try {
    const response = await fetch(`${API_URL}/goals`, {
      headers: authHeaders(token),
    })

    if (!response.ok) {
      return rejectWithValue(await readError(response, 'Nao foi possivel carregar as metas.'))
    }

    return await response.json()
  } catch {
    return rejectWithValue('Nao foi possivel conectar a API.')
  }
})

export const createGoal = createAsyncThunk<
  Goal,
  Omit<Goal, 'id' | 'createdAt'>,
  { state: RootState; rejectValue: string }
>('goals/createGoal', async (goalData, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  if (!token) {
    return rejectWithValue('Sessao expirada. Faca login novamente.')
  }

  try {
    const response = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(goalData),
    })

    if (!response.ok) {
      return rejectWithValue(await readError(response, 'Nao foi possivel criar a meta.'))
    }

    return await response.json()
  } catch {
    return rejectWithValue('Nao foi possivel conectar a API.')
  }
})

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    clearGoalError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false
        state.goals = action.payload
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Erro ao carregar metas.'
      })
      .addCase(createGoal.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.creating = false
        state.goals = [action.payload, ...state.goals]
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload || 'Erro ao criar meta.'
      })
  },
})

export const { clearGoalError } = goalsSlice.actions

export const selectGoals = (state: RootState) => state.goals.goals
export const selectGoalsLoading = (state: RootState) => state.goals.loading
export const selectGoalsError = (state: RootState) => state.goals.error

export const selectGoalProgress = (goalId: number) =>
  createSelector(
    [(state: RootState) => state.goals.goals, (state: RootState) => state.transactions.transactions],
    (goals, transactions) => {
      const goal = goals.find((item) => item.id === goalId)

      if (!goal) {
        return 0
      }

      const incomeTransactions = transactions.filter(
        (transaction: Transaction) =>
          transaction.type === 'INCOME' && transaction.amount > 0,
      )

      const totalIncome = incomeTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0,
      )

      if (goal.targetAmount <= 0) {
        return 0
      }

      const ratio = Math.min(100, (totalIncome / goal.targetAmount) * 100)
      return Number(ratio.toFixed(2))
    },
  )

export default goalsSlice.reducer
