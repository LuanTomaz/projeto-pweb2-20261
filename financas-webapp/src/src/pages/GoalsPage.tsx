import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../app/store'
import { selectGoalsOrderedByDeadline, selectGoalsTotal, selectTotalGoalAmount } from '../features/goals/goalSelectors'
import { GoalsList } from '../features/goals/components/GoalsList'

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function GoalsPage() {
  const goals = useSelector((state: RootState) => selectGoalsOrderedByDeadline(state))
  const total = useSelector((state: RootState) => selectGoalsTotal(state))
  const totalAmount = useSelector((state: RootState) => selectTotalGoalAmount(state))

  return (
    <main className="app-shell">
      <section className="page-header finance-hero">
        <div><span className="eyebrow">RF05</span><h1>Metas financeiras</h1><p>Planeje seus objetivos e acompanhe o valor necessário para realizá-los.</p></div>
        <Link className="primary-action" to="/goals/new">Nova meta</Link>
      </section>
      <section className="summary-grid">
        <article className="summary-card income-card"><span>Metas cadastradas</span><strong>{total}</strong></article>
        <article className="summary-card balance-card"><span>Valor total planejado</span><strong className="amount-income">{currencyFormatter.format(totalAmount)}</strong></article>
      </section>
      <section className="content-panel"><div className="panel-title-row"><div><h2>Seus objetivos</h2><p>Ordenados pelo prazo mais próximo.</p></div></div><GoalsList goals={goals} /></section>
    </main>
  )
}
