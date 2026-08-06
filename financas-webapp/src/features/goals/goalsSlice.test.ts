import reducer, { addGoal, removeGoal } from './goalsSlice'

const goal = {
  id: 'goal-1',
  name: 'Reserva',
  targetAmount: 5000,
  currentAmount: 0,
  deadline: '2026-12-31',
  createdAt: '2026-08-03T00:00:00.000Z',
}

describe('goalsSlice', () => {
  it('adiciona uma meta', () => {
    const state = reducer(undefined, addGoal(goal))
    expect(state.goals).toEqual([goal])
  })

  it('remove uma meta pelo id', () => {
    const state = reducer({ goals: [goal] }, removeGoal(goal.id))
    expect(state.goals).toEqual([])
  })
})
