import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Toolbar,
  Breadcrumbs,
  Link,
  Grid
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useSnackbar } from 'notistack'
import Header from '../../components/common/Header'
import Sidebar from '../../components/common/Sidebar'
import ExpenseForm from '../../components/finances/ExpenseForm'
import { ExpenseFormData } from '../../types/finance.types'
import { createExpense } from '../../services/financeService'

const AddExpense = () => {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const drawerWidth = 240

  const handleSubmit = async (data: ExpenseFormData) => {
    setSubmitting(true)
    try {
      await createExpense(data)
      enqueueSnackbar('Despesa adicionada com sucesso', { variant: 'success' })
      navigate('/finances')
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao adicionar despesa', { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onMenuClick={() => setOpen(true)} />
      <Sidebar open={open} onClose={() => setOpen(false)} width={drawerWidth} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        
        <Container>
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link 
                color="inherit" 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/finances')
                }}
              >
                Finanças
              </Link>
              <Typography color="text.primary">Nova Despesa</Typography>
            </Breadcrumbs>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h4">Nova Despesa</Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/finances')}
            >
              Voltar
            </Button>
          </Box>
          
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8, lg: 6 }}>
              <Paper sx={{ p: 3 }}>
                <ExpenseForm onSubmit={handleSubmit} isSubmitting={submitting} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default AddExpense