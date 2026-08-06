import { selectGoalsOrderedByDeadline, selectGoalsTotal, selectTotalGoalAmount } from './goalSelectors'

const state = {
  goals: {
    goals: [
      { id: '2', name: 'Viagem', targetAmount: 3000, currentAmount: 0, deadline: '2026-12-01', createdAt: '2026-01-01' },
      { id: '1', name: 'Reserva', targetAmount: 5000, currentAmount: 0, deadline: '2026-10-01', createdAt: '2026-01-01' },
    ],
  },
}

describe('goal selectors', () => {
  it('calcula a quantidade e o valor planejado', () => {
    expect(selectGoalsTotal(state)).toBe(2)
    expect(selectTotalGoalAmount(state)).toBe(8000)
  })

  it('ordena metas pelo prazo', () => {
    expect(selectGoalsOrderedByDeadline(state).map((goal) => goal.id)).toEqual(['1', '2'])
  })
})
