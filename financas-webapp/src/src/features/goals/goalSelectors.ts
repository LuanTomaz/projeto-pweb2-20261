import { createSelector } from '@reduxjs/toolkit'
import type { Goal } from './goalsSlice'

type GoalsState = { goals: { goals: Goal[] } }

export const selectGoals = (state: GoalsState) => state.goals.goals

export const selectGoalsTotal = createSelector([selectGoals], (goals) => goals.length)

export const selectTotalGoalAmount = createSelector([selectGoals], (goals) =>
  goals.reduce((total, goal) => total + goal.targetAmount, 0),
)

export const selectGoalsOrderedByDeadline = createSelector([selectGoals], (goals) =>
  [...goals].sort((first, second) => first.deadline.localeCompare(second.deadline)),
)
