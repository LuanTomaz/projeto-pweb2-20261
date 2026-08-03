import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

const API_URL = '/api'

export interface SpendingLimit {
  id: number
  categoryId: number
  categoryName: string
  limitAmount: number
  period: 'MONTH' | 'WEEK' | 'YEAR'
}

interface SpendingLimitState {
  items: SpendingLimit[]
  loading: boolean
  creating: boolean
  deletingId: number | null
  error: string | null
}

const initialState: SpendingLimitState = {
  items: [],
  loading: false,
  creating: false,
  deletingId: null,
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

export const fetchSpendingLimits = createAsyncThunk<
  SpendingLimit[],
  void,
  { state: RootState; rejectValue: string }
>('limits/fetchSpendingLimits', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  if (!token) {
    return rejectWithValue('Sessao expirada. Faca login novamente.')
  }

  try {
    const response = await fetch(`${API_URL}/limits`, {
      headers: authHeaders(token),
    })

    if (!response.ok) {
      return rejectWithValue(
        await readError(response, 'Nao foi possivel carregar os limites.'),
      )
    }

    return (await response.json()) as SpendingLimit[]
  } catch {
    return rejectWithValue('Nao foi possivel conectar a API.')
  }
})

export const createSpendingLimit = createAsyncThunk<
  SpendingLimit,
  Omit<SpendingLimit, 'id' | 'categoryName'>,
  { state: RootState; rejectValue: string }
>('limits/createSpendingLimit', async (limitData, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  if (!token) {
    return rejectWithValue('Sessao expirada. Faca login novamente.')
  }

  try {
    const response = await fetch(`${API_URL}/limits`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(limitData),
    })

    if (!response.ok) {
      return rejectWithValue(
        await readError(response, 'Nao foi possivel criar o limite.'),
      )
    }

    return (await response.json()) as SpendingLimit
  } catch {
    return rejectWithValue('Nao foi possivel conectar a API.')
  }
})

export const deleteSpendingLimit = createAsyncThunk<
  number,
  number,
  { state: RootState; rejectValue: string }
>('limits/deleteSpendingLimit', async (limitId, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  if (!token) {
    return rejectWithValue('Sessao expirada. Faca login novamente.')
  }

  try {
    const response = await fetch(`${API_URL}/limits/${limitId}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    })

    if (!response.ok) {
      return rejectWithValue(
        await readError(response, 'Nao foi possivel excluir o limite.'),
      )
    }

    return limitId
  } catch {
    return rejectWithValue('Nao foi possivel conectar a API.')
  }
})

const limitsSlice = createSlice({
  name: 'limits',
  initialState,
  reducers: {
    clearLimitsError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpendingLimits.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSpendingLimits.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchSpendingLimits.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Erro desconhecido'
      })
      .addCase(createSpendingLimit.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createSpendingLimit.fulfilled, (state, action) => {
        state.creating = false
        state.items = [action.payload, ...state.items]
      })
      .addCase(createSpendingLimit.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload ?? 'Erro desconhecido'
      })
      .addCase(deleteSpendingLimit.pending, (state, action) => {
        state.deletingId = action.meta.arg
      })
      .addCase(deleteSpendingLimit.fulfilled, (state, action) => {
        state.deletingId = null
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteSpendingLimit.rejected, (state, action) => {
        state.deletingId = null
        state.error = action.payload ?? 'Erro desconhecido'
      })
  },
})

export const { clearLimitsError } = limitsSlice.actions
export default limitsSlice.reducer

export const selectSpendingLimits = (state: RootState) => state.limits.items
export const selectSpendingLimitsLoading = (state: RootState) => state.limits.loading
export const selectSpendingLimitsError = (state: RootState) => state.limits.error

export const selectSpendingStatusByCategory = createSelector(
  [
    (state: RootState) => state.transactions.transactions,
    (state: RootState) => state.limits.items,
  ],
  (transactions, limits) => {
    const totalsByCategory = transactions.reduce<Record<number, number>>((acc, transaction) => {
      if (transaction.type === 'EXPENSE') {
        acc[transaction.categoryId] = (acc[transaction.categoryId] ?? 0) + transaction.amount
      }
      return acc
    }, {})

    return limits.map((limit) => ({
      ...limit,
      spentAmount: totalsByCategory[limit.categoryId] ?? 0,
      isExceeded: (totalsByCategory[limit.categoryId] ?? 0) > limit.limitAmount,
    }))
  },
)
