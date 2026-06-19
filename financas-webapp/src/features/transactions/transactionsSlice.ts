import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

const API_URL = '/api'

export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Category {
  id: number
  name: string
}

interface CategoriesResponse {
  content?: Category[]
  categories?: Category[]
  data?: Category[]
}

export interface Transaction {
  id: number
  amount: number
  type: TransactionType
  categoryId: number
  categoryName: string
  date: string
  description: string | null
  tag: string | null
}

interface TransactionsPageResponse {
  content: Transaction[]
  number: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

interface FetchTransactionsParams {
  page?: number
  size?: number
}

export interface CreateTransactionData {
  amount: number
  type: TransactionType
  categoryId: number
  date: string
  description?: string
  tag?: string
}

export interface UpdateTransactionData extends CreateTransactionData {
  id: number
}

interface TransactionsState {
  categories: Category[]
  categoriesLoading: boolean
  transactions: Transaction[]
  selectedTransaction: Transaction | null
  page: number
  pageSize: number
  totalPages: number
  totalElements: number
  loading: boolean
  creating: boolean
  updating: boolean
  deletingId: number | null
  error: string | null
}

const initialState: TransactionsState = {
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

function parseCategories(data: Category[] | CategoriesResponse) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data.content)) {
    return data.content
  }

  if (Array.isArray(data.categories)) {
    return data.categories
  }

  if (Array.isArray(data.data)) {
    return data.data
  }

  return []
}

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { state: RootState; rejectValue: string }
>('transactions/fetchCategories', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  if (!token) {
    return rejectWithValue('Sessao expirada. Faca login novamente.')
  }

  try {
    const response = await fetch(`${API_URL}/categories`, {
      headers: authHeaders(token),
    })

    if (!response.ok) {
      return rejectWithValue(
        await readError(response, 'Nao foi possivel carregar as categorias.'),
      )
    }

    return parseCategories(await response.json())
  } catch {
    return rejectWithValue('Nao foi possivel conectar a API.')
  }
})

export const fetchTransactions = createAsyncThunk<
  TransactionsPageResponse,
  number | FetchTransactionsParams | undefined,
  { state: RootState; rejectValue: string }
>(
  'transactions/fetchTransactions',
  async (params = 0, { getState, rejectWithValue }) => {
    const token = getState().auth.token

    if (!token) {
      return rejectWithValue('Sessao expirada. Faca login novamente.')
    }

    try {
      const page = typeof params === 'number' ? params : params.page || 0
      const size = typeof params === 'number' ? 10 : params.size || 10

      const queryParams = new URLSearchParams({
        page: String(page),
        size: String(size),
        sort: 'date,desc',
      })

      const response = await fetch(`${API_URL}/transactions?${queryParams}`, {
        headers: authHeaders(token),
      })

      if (!response.ok) {
        return rejectWithValue(
          await readError(response, 'Nao foi possivel carregar as transacoes.'),
        )
      }

      return await response.json()
    } catch {
      return rejectWithValue('Nao foi possivel conectar a API.')
    }
  },
)

export const createTransaction = createAsyncThunk<
  Transaction,
  CreateTransactionData,
  { state: RootState; rejectValue: string }
>(
  'transactions/createTransaction',
  async (transactionData, { getState, rejectWithValue }) => {
    const token = getState().auth.token

    if (!token) {
      return rejectWithValue('Sessao expirada. Faca login novamente.')
    }

    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(transactionData),
      })

      if (!response.ok) {
        return rejectWithValue(
          await readError(response, 'Nao foi possivel registrar a transacao.'),
        )
      }

      return await response.json()
    } catch {
      return rejectWithValue('Nao foi possivel conectar a API.')
    }
  },
)

export const fetchTransactionById = createAsyncThunk<
  Transaction,
  number,
  { state: RootState; rejectValue: string }
>(
  'transactions/fetchTransactionById',
  async (transactionId, { getState, rejectWithValue }) => {
    const token = getState().auth.token

    if (!token) {
      return rejectWithValue('Sessao expirada. Faca login novamente.')
    }

    try {
      const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
        headers: authHeaders(token),
      })

      if (!response.ok) {
        return rejectWithValue(
          await readError(response, 'Nao foi possivel carregar a transacao.'),
        )
      }

      return await response.json()
    } catch {
      return rejectWithValue('Nao foi possivel conectar a API.')
    }
  },
)

export const updateTransaction = createAsyncThunk<
  Transaction,
  UpdateTransactionData,
  { state: RootState; rejectValue: string }
>(
  'transactions/updateTransaction',
  async ({ id, ...transactionData }, { getState, rejectWithValue }) => {
    const token = getState().auth.token

    if (!token) {
      return rejectWithValue('Sessão expirada. Faca login novamente.')
    }

    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(transactionData),
      })

      if (!response.ok) {
        return rejectWithValue(
          await readError(response, 'Nao foi possivel atualizar a transacao.'),
        )
      }

      return await response.json()
    } catch {
      return rejectWithValue('Nao foi possivel conectar a API.')
    }
  },
)

export const deleteTransaction = createAsyncThunk<
  number,
  number,
  { state: RootState; rejectValue: string }
>(
  'transactions/deleteTransaction',
  async (transactionId, { getState, rejectWithValue }) => {
    const token = getState().auth.token

    if (!token) {
      return rejectWithValue('Sessao expirada. Faca login novamente.')
    }

    try {
      const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
      })

      if (!response.ok) {
        return rejectWithValue(
          await readError(response, 'Nao foi possivel excluir a transacao.'),
        )
      }

      return transactionId
    } catch {
      return rejectWithValue('Nao foi possivel conectar a API.')
    }
  },
)

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false
        state.error = action.payload || 'Erro ao carregar categorias.'
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload.content
        state.page = action.payload.number
        state.pageSize = action.payload.size
        state.totalElements = action.payload.totalElements
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Erro ao carregar transacoes.'
      })
      .addCase(createTransaction.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createTransaction.fulfilled, (state) => {
        state.creating = false
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload || 'Erro ao registrar transacao.'
      })
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true
        state.error = null
        state.selectedTransaction = null
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedTransaction = action.payload
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Erro ao carregar transacao.'
      })
      .addCase(updateTransaction.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.updating = false
        state.selectedTransaction = action.payload
        state.transactions = state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction,
        )
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload || 'Erro ao atualizar transacao.'
      })
      .addCase(deleteTransaction.pending, (state, action) => {
        state.deletingId = action.meta.arg
        state.error = null
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.deletingId = null
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload,
        )
        state.totalElements = Math.max(0, state.totalElements - 1)
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.deletingId = null
        state.error = action.payload || 'Erro ao excluir transacao.'
      })
  },
})

export const { clearTransactionError } = transactionsSlice.actions

export const selectTransactions = (state: RootState) =>
  state.transactions.transactions

export const selectTransactionsLoading = (state: RootState) =>
  state.transactions.loading

export const selectTransactionsError = (state: RootState) =>
  state.transactions.error

export const selectCurrentBalance = createSelector(
  [selectTransactions],
  (transactions) =>
    transactions.reduce((balance, transaction) => {
      if (transaction.type === 'INCOME') {
        return balance + transaction.amount
      }

      return balance - transaction.amount
    }, 0),
)

export const selectMonthlyIncomeTotal = createSelector(
  [selectTransactions],
  (transactions) => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    return transactions
      .filter((transaction) => {
        const transactionDate = new Date(`${transaction.date}T00:00:00`)

        return (
          transaction.type === 'INCOME' &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        )
      })
      .reduce((total, transaction) => total + transaction.amount, 0)
  },
)

export const selectMonthlyExpenseTotal = createSelector(
  [selectTransactions],
  (transactions) => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    return transactions
      .filter((transaction) => {
        const transactionDate = new Date(`${transaction.date}T00:00:00`)

        return (
          transaction.type === 'EXPENSE' &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        )
      })
      .reduce((total, transaction) => total + transaction.amount, 0)
  },
)

export const selectRecentTransactions = createSelector(
  [selectTransactions],
  (transactions) =>
    [...transactions]
      .sort(
        (current, next) =>
          new Date(`${next.date}T00:00:00`).getTime() -
          new Date(`${current.date}T00:00:00`).getTime(),
      )
      .slice(0, 5),
)

export default transactionsSlice.reducer
