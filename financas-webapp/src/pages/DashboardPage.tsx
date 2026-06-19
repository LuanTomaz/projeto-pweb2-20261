import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import {
  fetchTransactions,
  selectCurrentBalance,
  selectMonthlyExpenseTotal,
  selectMonthlyIncomeTotal,
  selectRecentTransactions,
  selectTransactionsError,
  selectTransactionsLoading,
} from '../features/transactions/transactionsSlice'
import type { TransactionType } from '../features/transactions/transactionsSlice'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'UTC',
})

const typeLabels: Record<TransactionType, string> = {
  INCOME: 'Receita',
  EXPENSE: 'Despesa',
}

function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
  const balance = useSelector(selectCurrentBalance)
  const monthlyIncome = useSelector(selectMonthlyIncomeTotal)
  const monthlyExpense = useSelector(selectMonthlyExpenseTotal)
  const recentTransactions = useSelector(selectRecentTransactions)
  const loading = useSelector(selectTransactionsLoading)
  const error = useSelector(selectTransactionsError)

  useEffect(() => {
    dispatch(fetchTransactions({ page: 0, size: 1000 }))
  }, [dispatch])

  return (
    <main className="app-shell">
      <section className="page-header finance-hero">
        <div>
          <span className="eyebrow">RF03</span>
          <h1>Dashboard Financeiro</h1>
          <p>
            {user
              ? `Ola, ${user.name}. Acompanhe seu saldo, receitas e despesas do mes.`
              : 'Acompanhe seu saldo, receitas e despesas do mes.'}
          </p>
        </div>

        <div className="hero-wallet" aria-label="Saldo atual">
          <span>Saldo atual</span>
          <strong>{currencyFormatter.format(balance)}</strong>
          <small>
            {recentTransactions.length} movimentacoes recentes carregadas
          </small>
        </div>
      </section>

      {error && <p className="feedback feedback-error">{error}</p>}

      <section className="summary-grid" aria-label="Resumo financeiro">
        <article className="summary-card balance-card">
          <span>Saldo atual</span>
          <strong className={balance >= 0 ? 'amount-income' : 'amount-expense'}>
            {currencyFormatter.format(balance)}
          </strong>
        </article>

        <article className="summary-card income-card">
          <span>Receitas do mes</span>
          <strong className="amount-income">
            {currencyFormatter.format(monthlyIncome)}
          </strong>
        </article>

        <article className="summary-card expense-card">
          <span>Despesas do mes</span>
          <strong className="amount-expense">
            {currencyFormatter.format(monthlyExpense)}
          </strong>
        </article>
      </section>

      <section className="content-panel dashboard-panel">
        <div className="panel-title-row">
          <div>
            <h2>Transacoes recentes</h2>
            <p>As 5 movimentacoes mais recentes registradas.</p>
          </div>
          <Link className="secondary-action" to="/transactions">
            Ver todas
          </Link>
        </div>

        {loading ? (
          <p className="empty-state">Carregando transacoes...</p>
        ) : recentTransactions.length === 0 ? (
          <div className="empty-state">
            <strong>Nenhuma transacao registrada ainda.</strong>
            <span>Comece criando sua primeira receita ou despesa.</span>
            <Link className="primary-action" to="/transactions/new">
              Nova transacao
            </Link>
          </div>
        ) : (
          <div className="transactions-list">
            {recentTransactions.map((transaction) => (
              <article className="transaction-row" key={transaction.id}>
                <div className="transaction-main">
                  <span
                    className={`type-badge ${
                      transaction.type === 'INCOME' ? 'income' : 'expense'
                    }`}
                  >
                    {typeLabels[transaction.type]}
                  </span>
                  <div>
                    <h3>{transaction.description || transaction.categoryName}</h3>
                    <p>
                      {transaction.categoryName}
                      {transaction.tag ? ` / ${transaction.tag}` : ''}
                    </p>
                  </div>
                </div>

                <div className="transaction-meta">
                  <strong
                    className={
                      transaction.type === 'INCOME'
                        ? 'amount-income'
                        : 'amount-expense'
                    }
                  >
                    {transaction.type === 'INCOME' ? '+' : '-'}
                    {currencyFormatter.format(transaction.amount)}
                  </strong>
                  <span>
                    {dateFormatter.format(new Date(`${transaction.date}T00:00:00Z`))}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default DashboardPage
