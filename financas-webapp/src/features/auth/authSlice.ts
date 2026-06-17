import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API_URL = '/api'

interface AuthUser {
  id: number
  username: string
  name: string
}

interface AuthResponse {
  token: string
  id: number
  username: string
  name: string
}

interface LoginData {
  username: string
  password: string
}

interface RegisterData {
  name: string
  username: string
  password: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string | null
}

const savedToken = localStorage.getItem('token')
const savedUser = localStorage.getItem('user')

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken,
  loading: false,
  error: null,
}

async function handleAuthResponse(response: Response): Promise<AuthResponse> {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao autenticar usuário')
  }

  return data
}

export const login = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      return await handleAuthResponse(response)
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }

      return rejectWithValue('Erro inesperado ao fazer login')
    }
  },
)

export const register = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      })

      return await handleAuthResponse(response)
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }

      return rejectWithValue('Erro inesperado ao cadastrar usuário')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        const user = {
          id: action.payload.id,
          username: action.payload.username,
          name: action.payload.name,
        }

        state.loading = false
        state.token = action.payload.token
        state.user = user

        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(user))
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        const user = {
          id: action.payload.id,
          username: action.payload.username,
          name: action.payload.name,
        }

        state.loading = false
        state.token = action.payload.token
        state.user = user

        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(user))
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions

export default authSlice.reducer