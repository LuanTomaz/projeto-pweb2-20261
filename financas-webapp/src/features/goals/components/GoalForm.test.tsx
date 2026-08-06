import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { GoalForm } from './GoalForm'

describe('GoalForm', () => {
  it('valida os campos obrigatórios', async () => {
    const user = userEvent.setup()
    render(<GoalForm onSubmit={vi.fn()} />, { wrapper: MemoryRouter })
    await user.click(screen.getByRole('button', { name: 'Salvar meta' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Preencha nome, valor alvo e prazo.')
  })

  it('envia uma meta válida', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<GoalForm onSubmit={onSubmit} />, { wrapper: MemoryRouter })
    await user.type(screen.getByLabelText('Nome da meta'), 'Viagem')
    await user.type(screen.getByLabelText('Valor alvo'), '2500')
    fireEvent.change(screen.getByLabelText('Prazo'), { target: { value: '2026-12-31' } })
    await user.click(screen.getByRole('button', { name: 'Salvar meta' }))
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Viagem', targetAmount: 2500, deadline: '2026-12-31', description: undefined })
  })
})
