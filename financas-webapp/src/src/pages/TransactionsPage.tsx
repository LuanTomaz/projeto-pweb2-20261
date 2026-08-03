import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import {
  deleteTransaction,
  fetchCategories,
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
    categories,
    transactions,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    deletingId,
  } = useSelector((state: RootState) => state.transactions)

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    dispatch(
      fetchTransactions({
        page: 0,
        type: typeFilter || undefined,
        categoryId: categoryFilter ? Number(categoryFilter) : undefined,
      }),
    )
  }, [dispatch, typeFilter, categoryFilter])

  const filteredTransactions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      return transactions
    }

    return transactions.filter((transaction) => {
      return (
        transaction.description?.toLowerCase().includes(term) ||
        transaction.categoryName.toLowerCase().includes(term) ||
        transaction.tag?.toLowerCase().includes(term)
      )
    })
  }, [searchTerm, transactions])

  const totals = filteredTransactions.reduce(
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

  function handlePageChange(nextPage: number) {
    dispatch(
      fetchTransactions({
        page: nextPage,
        type: typeFilter || undefined,
        categoryId: categoryFilter ? Number(categoryFilter) : undefined,
      }),
    )
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

      <div className="filter-row">
        <div className="field">
          <label htmlFor="transaction-search">Buscar</label>
          <input
            id="transaction-search"
            type="search"
            placeholder="Descrição, categoria ou tag"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="transaction-type">Tipo</label>
          <select
            id="transaction-type"
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value as TransactionType | '')
            }
          >
            <option value="">Todos</option>
            <option value="INCOME">Receitas</option>
            <option value="EXPENSE">Despesas</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="transaction-category">Categoria</label>
          <select
            id="transaction-category"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
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
            <p>
              {filteredTransactions.length} de {totalElements} transação(ões)
              encontradas
            </p>
          </div>
        </div>

        {loading ? (
          <p className="empty-state">Carregando transacoes...</p>
        ) : filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <strong>Nenhuma transacao encontrada.</strong>
            <span>Altere os filtros ou cadastre uma nova transação.</span>
          </div>
        ) : (
          <div className="transactions-list">
            {filteredTransactions.map((transaction) => (
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
