import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GoalsList } from './GoalsList'

describe('GoalsList', () => {
  it('mostra o estado vazio com atalho para criar uma meta', () => {
    render(<GoalsList goals={[]} />, { wrapper: MemoryRouter })
    expect(screen.getByText('Nenhuma meta cadastrada.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Criar meta' })).toHaveAttribute('href', '/goals/new')
  })

  it('lista o nome, valor e prazo das metas', () => {
    render(<GoalsList goals={[{ id: '1', name: 'Reserva', targetAmount: 5000, currentAmount: 0, deadline: '2026-12-31', createdAt: '2026-01-01' }]} />, { wrapper: MemoryRouter })
    expect(screen.getByText('Reserva')).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes('5.000,00'))).toBeInTheDocument()
    expect(screen.getByText(/Prazo: 31\/12\/2026/)).toBeInTheDocument()
  })
})
