import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { GoalInput } from '../goalsSlice'

interface GoalFormProps {
  onSubmit: (goal: GoalInput) => void
}

export function GoalForm({ onSubmit }: GoalFormProps) {
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const amount = Number(targetAmount)

    if (!name.trim() || !targetAmount || !deadline) {
      setError('Preencha nome, valor alvo e prazo.')
      return
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Informe um valor alvo maior que zero.')
      return
    }

    setError('')
    onSubmit({ name: name.trim(), targetAmount: amount, deadline, description: description.trim() || undefined })
  }

  return (
    <form className="transaction-form" noValidate onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="goal-name">Nome da meta</label>
          <input id="goal-name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Reserva de emergência" />
        </div>
        <div className="field">
          <label htmlFor="goal-target">Valor alvo</label>
          <input id="goal-target" required min="0.01" step="0.01" type="number" value={targetAmount} onChange={(event) => setTargetAmount(event.target.value)} placeholder="0,00" />
        </div>
        <div className="field">
          <label htmlFor="goal-deadline">Prazo</label>
          <input id="goal-deadline" required type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="goal-description">Descrição</label>
        <textarea id="goal-description" rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Opcional" />
      </div>
      {error && <p role="alert" className="feedback feedback-error">{error}</p>}
      <div className="row-actions">
        <button className="primary-action" type="submit">Salvar meta</button>
        <Link className="secondary-action" to="/goals">Cancelar</Link>
      </div>
    </form>
  )
}
