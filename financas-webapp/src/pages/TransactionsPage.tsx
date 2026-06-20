import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import {
  deleteTransaction,
  fetchTransactions,
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

function TransactionsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    transactions,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    deletingId,
  } = useSelector((state: RootState) => state.transactions)

  const totals = transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'INCOME') {
        summary.income += transaction.amount
      } else {
        summary.expense += transaction.amount
      }

      return summary
    },
    { income: 0, expense: 0 },
  )

  const balance = totals.income - totals.expense

  useEffect(() => {
    dispatch(fetchTransactions(0))
  }, [dispatch])

  function handlePageChange(nextPage: number) {
    dispatch(fetchTransactions(nextPage))
  }

  async function handleDelete(transactionId: number) {
    const confirmed = window.confirm('Deseja excluir esta transacao?')

    if (!confirmed) {
      return
    }

    const result = await dispatch(deleteTransaction(transactionId))

    if (deleteTransaction.fulfilled.match(result) && transactions.length === 1) {
      dispatch(fetchTransactions(Math.max(0, page - 1)))
    }
  }

  return (
    <main className="app-shell">
      <section className="page-header finance-hero">
        <div>
          <span className="eyebrow">RF02</span>
          <h1>Transações</h1>
          <p>
            Receitas e despesas registradas em ordem cronológica, com categoria
            e data para acompanhar sua vida financeira.
          </p>
        </div>

        <div className="hero-wallet" aria-hidden="true">
          <span>Saldo da página</span>
          <strong>{currencyFormatter.format(balance)}</strong>
          <small>{totalElements} registros no histórico</small>
        </div>
      </section>

      {error && <p className="feedback feedback-error">{error}</p>}

      <div className="toolbar-row">
        <div>
          <strong>Controle de movimentações</strong>
          <span>Edite, exclua e acompanhe seus lançamentos recentes.</span>
        </div>
        <Link className="primary-action" to="/transactions/new">
          Nova transacao
        </Link>
      </div>

      <section className="summary-grid">
        <article className="summary-card income-card">
          <span>Receitas nesta página</span>
          <strong className="amount-income">
            {currencyFormatter.format(totals.income)}
          </strong>
        </article>
        <article className="summary-card expense-card">
          <span>Despesas nesta página</span>
          <strong className="amount-expense">
            {currencyFormatter.format(totals.expense)}
          </strong>
        </article>
        <article className="summary-card balance-card">
          <span>Saldo da página</span>
          <strong className={balance >= 0 ? 'amount-income' : 'amount-expense'}>
            {currencyFormatter.format(balance)}
          </strong>
        </article>
      </section>

      <section className="content-panel">
        <div className="panel-title-row">
          <div>
            <h2>Historico</h2>
            <p>{totalElements} transação(ões) encontradas</p>
          </div>
        </div>

        {loading ? (
          <p className="empty-state">Carregando transacoes...</p>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <strong>Nenhuma transacao registrada ainda.</strong>
            <span>Comece adicionando sua primeira receita ou despesa.</span>
          </div>
        ) : (
          <div className="transactions-list">
            {transactions.map((transaction) => (
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
                  <div className="row-actions">
                    <Link
                      className="icon-action"
                      to={`/transactions/${transaction.id}/edit`}
                    >
                      Editar
                    </Link>
                    <button
                      className="icon-action danger"
                      type="button"
                      disabled={deletingId === transaction.id}
                      onClick={() => handleDelete(transaction.id)}
                    >
                      {deletingId === transaction.id ? 'Excluindo...' : 'Excluir'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              disabled={page === 0 || loading}
              onClick={() => handlePageChange(page - 1)}
            >
              Anterior
            </button>
            <span>
              Pagina {page + 1} de {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages - 1 || loading}
              onClick={() => handlePageChange(page + 1)}
            >
              Proxima
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default TransactionsPage
