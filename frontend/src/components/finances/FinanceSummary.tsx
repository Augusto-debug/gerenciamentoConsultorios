import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { useState, useEffect } from 'react'
import { getFinancialSummary } from '../../services/financeService'
import { FinanceSummary as FinanceSummaryType } from '../../types/finance.types'
import { useSnackbar } from 'notistack'

const FinanceSummary = () => {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<FinanceSummaryType | null>(null)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const { enqueueSnackbar } = useSnackbar()

  const years = Array.from({ length: 5 }, (_, i) => year - 2 + i)
  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ]

  useEffect(() => {
    fetchSummary()
  }, [year, month])

  const fetchSummary = async () => {
    setLoading(true)
    try {
      const data = await getFinancialSummary(year, month)
      setSummary(data)
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao buscar resumo financeiro', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Resumo Financeiro</Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Ano</InputLabel>
              <Select
                value={year}
                label="Ano"
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Mês</InputLabel>
              <Select
                value={month}
                label="Mês"
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {months.map((m) => (
                  <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          summary && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      Receitas
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'success.main', mt: 1 }}>
                      {formatCurrency(summary.totalIncome)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      Despesas
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'error.main', mt: 1 }}>
                      {formatCurrency(summary.totalExpense)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      Saldo
                    </Typography>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: summary.balance >= 0 ? 'success.main' : 'error.main',
                        mt: 1
                      }}
                    >
                      {formatCurrency(summary.balance)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )
        )}
      </CardContent>
    </Card>
  )
}

export default FinanceSummary