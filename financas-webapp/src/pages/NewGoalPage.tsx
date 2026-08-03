import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { createGoal } from '../features/goals/goalsSlice'

function NewGoalPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { creating, error } = useSelector((state: RootState) => state.goals)

  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [category, setCategory] = useState('')
  const [formError, setFormError] = useState('')

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()

    if (!name.trim() || !targetAmount || !deadline) {
      setFormError('Preencha nome, valor-alvo e data-limite.')
      return
    }

    const numericTarget = Number(targetAmount)

    if (!Number.isFinite(numericTarget) || numericTarget <= 0) {
      setFormError('Informe um valor-alvo maior que zero.')
      return
    }

    setFormError('')

    const result = await dispatch(
      createGoal({
        name: name.trim(),
        targetAmount: numericTarget,
        deadline,
        category: category.trim() || undefined,
      }),
    )

    if (createGoal.fulfilled.match(result)) {
      navigate('/goals')
    }
  }

  return (
    <main className="app-shell">
      <section className="page-header">
        <div>
          <span className="eyebrow">Nova meta</span>
          <h1>Cadastrar meta financeira</h1>
          <p>Defina um objetivo de poupança e acompanhe o progresso com base nas receitas.</p>
        </div>
        <Link className="secondary-action" to="/goals">
          Voltar
        </Link>
      </section>

      <section className="content-panel form-panel">
        <form className="transaction-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Nome da meta</label>
            <input id="name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="targetAmount">Valor-alvo</label>
            <input id="targetAmount" type="number" min="0.01" step="0.01" value={targetAmount} onChange={(event) => setTargetAmount(event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="deadline">Data-limite</label>
            <input id="deadline" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="category">Categoria</label>
            <input id="category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Opcional" />
          </div>

          {(formError || error) && <p className="feedback feedback-error">{formError || error}</p>}

          <button className="primary-action" type="submit" disabled={creating}>
            {creating ? 'Salvando...' : 'Salvar meta'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default NewGoalPage
