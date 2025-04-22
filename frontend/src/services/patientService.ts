import api from './api'
import { Patient, PatientFormData } from '../types/patient.types'

export const createPatient = async (data: PatientFormData): Promise<Patient> => {
  try {
    const response = await api.post('/patients', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao criar paciente')
  }
}

export const getPatients = async (): Promise<Patient[]> => {
  try {
    const response = await api.get('/patients')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar pacientes')
  }
}

export const getPatient = async (id: number): Promise<Patient> => {
  try {
    const response = await api.get(`/patients/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar paciente')
  }
}

export const updatePatient = async (id: number, data: PatientFormData): Promise<Patient> => {
  try {
    const response = await api.patch(`/patients/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao atualizar paciente')
  }
}

export const deletePatient = async (id: number): Promise<void> => {
  try {
    await api.delete(`/patients/${id}`)
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao excluir paciente')
  }
}