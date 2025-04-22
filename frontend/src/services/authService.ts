import api from './api'
import { LoginData, RegisterData, AuthResponse } from '../types/auth.types'

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha na autenticação')
  }
}

export const registerUser = async (data: RegisterData): Promise<void> => {
  try {
    await api.post('/users', data)
  } catch (error: any) {
    throw error
  }
}