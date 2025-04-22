export interface Income {
  id: number
  amount: number
  source: string
  date: string
}

export interface Expense {
  id: number
  amount: number
  category: string
  date: string
}

export interface FinanceSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  period: {
    year: number
    month: number | null
  }
}

export interface IncomeFormData {
  amount: number
  source: string
  date: string
}

export interface ExpenseFormData {
  amount: number
  category: string
  date: string
}