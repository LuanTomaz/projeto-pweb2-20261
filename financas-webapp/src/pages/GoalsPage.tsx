import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { fetchGoals, selectGoals, selectGoalsError, selectGoalsLoading, selectGoalProgress } from '../features/goals/goalsSlice'
import type { Goal } from '../features/goals/goalsSlice'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function GoalProgress({ goal }: { goal: Goal }) {
  const progress = useSelector((state: RootState) => selectGoalProgress(goal.id)(state))

  return (
    <div className="transaction-meta">
      <strong>{progress}%</strong>
      <span>Progresso atual</span>
    </div>
  )
}

function GoalsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const goals = useSelector(selectGoals)
  const loading = useSelector(selectGoalsLoading)
  const error = useSelector(selectGoalsError)

  useEffect(() => {
    dispatch(fetchGoals())
  }, [dispatch])

  return (
    <main className="app-shell">
      <section className="page-header">
        <div>
          <span className="eyebrow">RF05</span>
          <h1>Metas financeiras</h1>
          <p>Acompanhe o progresso das suas metas de poupança a partir das receitas registradas.</p>
        </div>
        <Link className="primary-action" to="/goals/new">
          Nova meta
        </Link>
      </section>

      {error && <p className="feedback feedback-error">{error}</p>}

      {loading ? (
        <p className="empty-state">Carregando metas...</p>
      ) : goals.length === 0 ? (
        <div className="empty-state">
          <strong>Nenhuma meta cadastrada ainda.</strong>
          <span>Crie uma meta para começar a acompanhar seu progresso.</span>
        </div>
      ) : (
        <section className="content-panel">
          {goals.map((goal) => (
            <article className="transaction-row" key={goal.id}>
              <div className="transaction-main">
                <div>
                  <h3>{goal.name}</h3>
                  <p>
                    Meta de {currencyFormatter.format(goal.targetAmount)} • até {goal.deadline}
                    {goal.category ? ` • ${goal.category}` : ''}
                  </p>
                </div>
              </div>
              <GoalProgress goal={goal} />
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default GoalsPage
