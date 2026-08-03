import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import {
  createSpendingLimit,
  deleteSpendingLimit,
  fetchSpendingLimits,
  selectSpendingLimitsError,
  selectSpendingLimitsLoading,
  selectSpendingStatusByCategory,
} from '../features/limits/limitsSlice'
import { fetchCategories } from '../features/transactions/transactionsSlice'
import { requestNotificationPermission, showNotification } from '../utils/notifications'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function LimitsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const loading = useSelector(selectSpendingLimitsLoading)
  const error = useSelector(selectSpendingLimitsError)
  const status = useSelector(selectSpendingStatusByCategory)
  const categories = useSelector((state: RootState) => state.transactions.categories)
  const { token } = useSelector((state: RootState) => state.auth)
  const [categoryId, setCategoryId] = useState('')
  const [limitAmount, setLimitAmount] = useState('')
  const [period, setPeriod] = useState<'MONTH' | 'WEEK' | 'YEAR'>('MONTH')

  useEffect(() => {
    if (token) {
      void dispatch(fetchSpendingLimits())
      void dispatch(fetchCategories())
      void requestNotificationPermission()
    }
  }, [dispatch, token])

  useEffect(() => {
    const exceeded = status.find((item) => item.isExceeded)

    if (exceeded) {
      showNotification('Limite de gasto atingido', {
        body: `${exceeded.categoryName} ultrapassou o limite configurado.`,
      })
    }
  }, [status])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!categoryId || !limitAmount) {
      return
    }

    await dispatch(
      createSpendingLimit({
        categoryId: Number(categoryId),
        limitAmount: Number(limitAmount),
        period,
      }),
    )

    setCategoryId('')
    setLimitAmount('')
    setPeriod('MONTH')
  }

  return (
    <main className="app-shell">
      <section className="page-header finance-hero">
        <div>
          <span className="eyebrow">RF06</span>
          <h1>Limites de gastos</h1>
          <p>Defina limites por categoria e acompanhe se o consumo ultrapassou o orçamento.</p>
        </div>
      </section>

      {error && <p className="feedback feedback-error">{error}</p>}

      <section className="content-panel transaction-form">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="categoryId">Categoria</label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="limitAmount">Valor limite</label>
              <input
                id="limitAmount"
                type="number"
                min="0"
                step="0.01"
                value={limitAmount}
                onChange={(event) => setLimitAmount(event.target.value)}
                placeholder="100.00"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="period">Periodo</label>
              <select id="period" value={period} onChange={(event) => setPeriod(event.target.value as 'MONTH' | 'WEEK' | 'YEAR')}>
                <option value="MONTH">Mensal</option>
                <option value="WEEK">Semanal</option>
                <option value="YEAR">Anual</option>
              </select>
            </div>
          </div>
          <button className="primary-action" type="submit">
            Salvar limite
          </button>
        </form>
      </section>

      <section className="content-panel">
        <div className="panel-title-row">
          <div>
            <h2>Status por categoria</h2>
            <p>Comparando gastos registrados com os limites configurados.</p>
          </div>
        </div>

        {loading ? (
          <p className="empty-state">Carregando limites...</p>
        ) : status.length === 0 ? (
          <div className="empty-state">
            <strong>Nenhum limite cadastrado.</strong>
            <span>Adicione um novo limite para começar o acompanhamento.</span>
          </div>
        ) : (
          <div className="transactions-list">
            {status.map((item) => (
              <article className="transaction-row" key={item.id}>
                <div className="transaction-main">
                  <div>
                    <h3>{item.categoryName}</h3>
                    <p>Limite {currencyFormatter.format(item.limitAmount)} • {item.period}</p>
                  </div>
                </div>
                <div className="transaction-meta">
                  <strong className={item.isExceeded ? 'amount-expense' : 'amount-income'}>
                    {currencyFormatter.format(item.spentAmount)} / {currencyFormatter.format(item.limitAmount)}
                  </strong>
                  <span>{item.isExceeded ? 'Acima do limite' : 'Dentro do limite'}</span>
                  <button className="icon-action danger" type="button" onClick={() => void dispatch(deleteSpendingLimit(item.id))}>
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default LimitsPage
