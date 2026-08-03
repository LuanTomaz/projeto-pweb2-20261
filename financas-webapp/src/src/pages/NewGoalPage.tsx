import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch } from '../app/store'
import { GoalForm } from '../features/goals/components/GoalForm'
import { addGoal, type GoalInput } from '../features/goals/goalsSlice'

export default function NewGoalPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  function handleCreate(goal: GoalInput) {
    dispatch(addGoal({ ...goal, id: crypto.randomUUID(), currentAmount: 0, createdAt: new Date().toISOString() }))
    navigate('/goals')
  }

  return <main className="app-shell"><section className="page-header"><div><span className="eyebrow">Nova meta</span><h1>Criar meta financeira</h1><p>Defina um objetivo, o valor que deseja alcançar e seu prazo.</p></div></section><section className="content-panel form-panel"><GoalForm onSubmit={handleCreate} /></section></main>
}
