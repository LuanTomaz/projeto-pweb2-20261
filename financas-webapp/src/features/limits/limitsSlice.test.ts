import { describe, expect, it } from 'vitest'
import { selectSpendingStatusByCategory } from './limitsSlice'
import type { RootState } from '../../app/store'

const createState = (): RootState => ({
  auth: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  transactions: {
    categories: [],
    categoriesLoading: false,
    transactions: [
      {
        id: 1,
        amount: 120,
        type: 'EXPENSE' as const,
        categoryId: 2,
        categoryName: 'Alimentação',
        date: '2026-08-01',
        description: 'Mercado',
        tag: null,
      },
      {
        id: 2,
        amount: 70,
        type: 'INCOME' as const,
        categoryId: 2,
        categoryName: 'Salário',
        date: '2026-08-02',
        description: 'Salario',
        tag: null,
      },
      {
        id: 3,
        amount: 90,
        type: 'EXPENSE' as const,
        categoryId: 5,
        categoryName: 'Transporte',
        date: '2026-08-03',
        description: 'Ônibus',
        tag: null,
      },
    ],
    selectedTransaction: null,
    page: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 3,
    loading: false,
    creating: false,
    updating: false,
    deletingId: null,
    error: null,
  },
  limits: {
    items: [
      {
        id: 1,
        categoryId: 2,
        categoryName: 'Alimentação',
        limitAmount: 100,
        period: 'MONTH' as const,
      },
      {
        id: 2,
        categoryId: 5,
        categoryName: 'Transporte',
        limitAmount: 80,
        period: 'MONTH' as const,
      },
    ],
    loading: false,
    creating: false,
    deletingId: null,
    error: null,
  },
}) as RootState

describe('selectSpendingStatusByCategory', () => {
  it('soma despesas por categoria e marca limites excedidos', () => {
    const result = selectSpendingStatusByCategory(createState())

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({
      categoryId: 2,
      spentAmount: 120,
      isExceeded: true,
    })
    expect(result[1]).toMatchObject({
      categoryId: 5,
      spentAmount: 90,
      isExceeded: true,
    })
  })
})
