import { Link } from 'react-router-dom'
import type { Goal } from '../goalsSlice'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' })

interface GoalsListProps {
  goals: Goal[]
}

export function GoalsList({ goals }: GoalsListProps) {
  if (goals.length === 0) {
    return (
      <div className="empty-state">
        <strong>Nenhuma meta cadastrada.</strong>
        <span>Crie sua primeira meta financeira para acompanhar seus planos.</span>
        <Link className="primary-action" to="/goals/new">Criar meta</Link>
      </div>
    )
  }

  return (
    <div className="transactions-list" aria-label="Lista de metas">
      {goals.map((goal) => (
        <article className="transaction-row" key={goal.id}>
          <div className="transaction-main">
            <span className="type-badge income">Meta</span>
            <div>
              <h3>{goal.name}</h3>
              {goal.description && <p>{goal.description}</p>}
            </div>
          </div>
          <div className="transaction-meta">
            <strong className="amount-income">{currencyFormatter.format(goal.targetAmount)}</strong>
            <span>Prazo: {dateFormatter.format(new Date(`${goal.deadline}T00:00:00Z`))}</span>
          </div>
        </article>
      ))}
    </div>
  )
}
