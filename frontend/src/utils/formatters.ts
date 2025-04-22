import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    return format(date, 'dd/MM/yyyy', { locale: ptBR })
  } catch (e) {
    return 'Data inválida'
  }
}

export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR })
  } catch (e) {
    return 'Data inválida'
  }
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}