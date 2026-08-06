import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  description?: string
  createdAt: string
}

export interface GoalInput {
  name: string
  targetAmount: number
  deadline: string
  description?: string
}

interface GoalsState {
  goals: Goal[]
}

const initialState: GoalsState = { goals: [] }

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<Goal>) => {
      state.goals.push(action.payload)
    },
    removeGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((goal) => goal.id !== action.payload)
    },
  },
})

export const { addGoal, removeGoal } = goalsSlice.actions
export { initialState as goalsInitialState }
export default goalsSlice.reducer
