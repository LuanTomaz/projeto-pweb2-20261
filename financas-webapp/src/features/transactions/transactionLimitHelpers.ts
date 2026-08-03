import type { SpendingLimit } from '../limits/limitsSlice'
import type { Transaction, TransactionType } from './transactionsSlice'

interface TransactionLimitEvaluationParams {
  transactions: Transaction[]
  limits: SpendingLimit[]
  categoryId: number
  amount: number
  type: TransactionType
  date: string
}

export interface TransactionLimitEvaluationResult {
  isAllowed: boolean
  reason: string | null
  remainingAmount: number
  limitAmount: number | null
}

function matchesPeriod(limit: SpendingLimit, transactionDate: string) {
  const date = new Date(`${transactionDate}T00:00:00`)
  const now = new Date()

  if (limit.period === 'WEEK') {
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay())
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)

    return date >= start && date <= end
  }

  if (limit.period === 'YEAR') {
    return date.getFullYear() === now.getFullYear()
  }

  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
}

export function evaluateTransactionAgainstLimits({
  transactions,
  limits,
  categoryId,
  amount,
  type,
  date,
}: TransactionLimitEvaluationParams): TransactionLimitEvaluationResult {
  if (type !== 'EXPENSE') {
    return {
      isAllowed: true,
      reason: null,
      remainingAmount: amount,
      limitAmount: null,
    }
  }

  const matchingLimit = limits.find(
    (limit) => limit.categoryId === categoryId && matchesPeriod(limit, date),
  )

  if (!matchingLimit) {
    return {
      isAllowed: true,
      reason: null,
      remainingAmount: amount,
      limitAmount: null,
    }
  }

  const spentInCurrentPeriod = transactions.reduce((total, transaction) => {
    if (
      transaction.type === 'EXPENSE' &&
      transaction.categoryId === categoryId &&
      matchesPeriod(
        {
          ...matchingLimit,
          categoryName: transaction.categoryName,
          categoryId: transaction.categoryId,
          limitAmount: matchingLimit.limitAmount,
          period: matchingLimit.period,
        },
        transaction.date,
      )
    ) {
      return total + transaction.amount
    }

    return total
  }, 0)

  const projectedSpent = spentInCurrentPeriod + amount
  const remainingAmount = Math.max(0, matchingLimit.limitAmount - projectedSpent)

  return {
    isAllowed: projectedSpent <= matchingLimit.limitAmount,
    reason:
      projectedSpent <= matchingLimit.limitAmount
        ? null
        : `O gasto excede o limite da categoria ${matchingLimit.categoryName}.`,
    remainingAmount,
    limitAmount: matchingLimit.limitAmount,
  }
}
