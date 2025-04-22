import api from './api'
import { Income, Expense, IncomeFormData, ExpenseFormData, FinanceSummary } from '../types/finance.types'

// Income Services
export const getIncomes = async (): Promise<Income[]> => {
  try {
    const response = await api.get('/finances/incomes')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar receitas')
  }
}

export const createIncome = async (data: IncomeFormData): Promise<Income> => {
  try {
    const response = await api.post('/finances/incomes', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao criar receita')
  }
}

export const deleteIncome = async (id: number): Promise<void> => {
  try {
    await api.delete(`/finances/incomes/${id}`)
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao excluir receita')
  }
}

// Expense Services
export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const response = await api.get('/finances/expenses')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar despesas')
  }
}

export const createExpense = async (data: ExpenseFormData): Promise<Expense> => {
  try {
    const response = await api.post('/finances/expenses', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao criar despesa')
  }
}

export const deleteExpense = async (id: number): Promise<void> => {
  try {
    await api.delete(`/finances/expenses/${id}`)
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao excluir despesa')
  }
}

// Summary Service
export const getFinancialSummary = async (year: number, month: number): Promise<FinanceSummary> => {
  try {
    const response = await api.get(`/finances/summary?year=${year}&month=${month}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar resumo financeiro')
  }
}