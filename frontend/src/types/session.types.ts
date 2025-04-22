import { Patient } from './patient.types'

export interface Session {
  id: number
  date: string
  duration: number
  notes: string | null
  patientId: number
  patient: Patient
}

export interface SessionFormData {
  date: string
  duration: number
  notes?: string
  patientId: number
}