export interface Patient {
  id: number
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  createdAt: string
}

export interface PatientFormData {
  name: string
  email?: string
  phone?: string
  notes?: string
}