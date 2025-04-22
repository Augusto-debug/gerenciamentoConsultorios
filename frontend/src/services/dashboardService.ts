import api from './api'

interface DashboardData {
  patientCount: number
  upcomingSessions: number
  monthlyIncome: number
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get('/dashboard')
    return response.data
  } catch (error: any) {
    // Dados temporários caso a API não esteja implementada
    if (error.response?.status === 404) {
      return {
        patientCount: await countPatients(),
        upcomingSessions: await countUpcomingSessions(),
        monthlyIncome: await calculateMonthlyIncome()
      }
    }
    throw new Error(error.response?.data?.message || 'Erro ao buscar dados do dashboard')
  }
}

// Funções auxiliares para cálculos caso o endpoint não exista
async function countPatients(): Promise<number> {
  try {
    const response = await api.get('/patients')
    return response.data.length
  } catch (error) {
    return 0
  }
}

async function countUpcomingSessions(): Promise<number> {
  try {
    const response = await api.get('/sessions')
    const now = new Date()
    const nextWeek = new Date(now)
    nextWeek.setDate(now.getDate() + 7)
    
    return response.data.filter((session: any) => {
      const sessionDate = new Date(session.date)
      return sessionDate >= now && sessionDate <= nextWeek
    }).length
  } catch (error) {
    return 0
  }
}

async function calculateMonthlyIncome(): Promise<number> {
  try {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    
    const response = await api.get(`/finances/summary?year=${year}&month=${month}`)
    return response.data.totalIncome
  } catch (error) {
    return 0
  }
}