import api from './api'
import { Session, SessionFormData } from '../types/session.types'

export const createSession = async (data: SessionFormData): Promise<Session> => {
  try {
    const response = await api.post('/sessions', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao criar sessão')
  }
}

export const getSessions = async (): Promise<Session[]> => {
  try {
    const response = await api.get('/sessions')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar sessões')
  }
}

export const getSessionsByPatient = async (patientId: number): Promise<Session[]> => {
  try {
    const response = await api.get(`/sessions/patient/${patientId}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar sessões do paciente')
  }
}

export const getSession = async (id: number): Promise<Session> => {
  try {
    const response = await api.get(`/sessions/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar sessão')
  }
}

export const updateSession = async (id: number, data: SessionFormData): Promise<Session> => {
  try {
    const response = await api.patch(`/sessions/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao atualizar sessão')
  }
}

export const deleteSession = async (id: number): Promise<void> => {
  try {
    await api.delete(`/sessions/${id}`)
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao excluir sessão')
  }
}