import { useEffect, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import {
  fetchCategories,
  fetchTransactionById,
  updateTransaction,
} from '../features/transactions/transactionsSlice'
import type { TransactionType } from '../features/transactions/transactionsSlice'

function EditTransactionPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const { categories, selectedTransaction, loading, updating, error } =
    useSelector((state: RootState) => state.transactions)

  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('EXPENSE')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [tag, setTag] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    dispatch(fetchCategories())

    if (transactionId) {
      dispatch(fetchTransactionById(Number(transactionId)))
    }
  }, [dispatch, transactionId])

  useEffect(() => {
    if (!selectedTransaction) {
      return
    }

    setAmount(String(selectedTransaction.amount))
    setType(selectedTransaction.type)
    setCategoryId(String(selectedTransaction.categoryId))
    setDate(selectedTransaction.date)
    setDescription(selectedTransaction.description || '')
    setTag(selectedTransaction.tag || '')
  }, [selectedTransaction])

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()

    const numericAmount = Number(amount)

    if (!transactionId || !amount || !categoryId || !date) {
      setFormError('Preencha valor, categoria e data.')
      return
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setFormError('Informe um valor maior que zero.')
      return
    }

    setFormError('')

    const result = await dispatch(
      updateTransaction({
        id: Number(transactionId),
        amount: numericAmount,
        type,
        categoryId: Number(categoryId),
        date,
        description: description.trim() || undefined,
        tag: tag.trim() || undefined,
      }),
    )

    if (updateTransaction.fulfilled.match(result)) {
      navigate('/transactions')
    }
  }

  return (
    <main className="app-shell">
      <section className="page-header">
        <div>
          <span className="eyebrow">Edicao</span>
          <h1>Editar transacao</h1>
          <p>Ajuste valor, categoria, data ou detalhes do registro financeiro.</p>
        </div>

        <Link className="secondary-action" to="/transactions">
          Voltar
        </Link>
      </section>

      <section className="content-panel form-panel form-studio">
        {loading && !selectedTransaction ? (
          <p className="empty-state">Carregando transacao...</p>
        ) : (
          <>
            <aside className="form-insight">
              <span>Alteracao</span>
              <strong>{type === 'INCOME' ? 'Receita' : 'Despesa'}</strong>
              <p>
                Valor atual:{' '}
                {amount ? `R$ ${Number(amount).toFixed(2)}` : 'R$ 0,00'}
              </p>
            </aside>

            <form className="transaction-form" onSubmit={handleSubmit}>
              <fieldset className="segmented-control">
                <legend>Tipo</legend>
                <label className={type === 'EXPENSE' ? 'selected' : ''}>
                  <input
                    checked={type === 'EXPENSE'}
                    name="type"
                    type="radio"
                    value="EXPENSE"
                    onChange={() => setType('EXPENSE')}
                  />
                  Despesa
                </label>
                <label className={type === 'INCOME' ? 'selected' : ''}>
                  <input
                    checked={type === 'INCOME'}
                    name="type"
                    type="radio"
                    value="INCOME"
                    onChange={() => setType('INCOME')}
                  />
                  Receita
                </label>
              </fieldset>

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="amount">Valor</label>
                  <input
                    id="amount"
                    min="0.01"
                    step="0.01"
                    type="number"
                    required
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="category">Categoria</label>
                  <select
                    id="category"
                    required
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                  >
                    <option value="">Selecione</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="date">Data</label>
                  <input
                    id="date"
                    type="date"
                    required
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="tag">Tag</label>
                  <input
                    id="tag"
                    type="text"
                    value={tag}
                    onChange={(event) => setTag(event.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="description">Descricao</label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Opcional"
                />
              </div>

              {(formError || error) && (
                <p className="feedback feedback-error">{formError || error}</p>
              )}

              <button className="primary-action" type="submit" disabled={updating}>
                {updating ? 'Salvando...' : 'Salvar alteracoes'}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  )
}

export default EditTransactionPage
