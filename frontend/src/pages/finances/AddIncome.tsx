import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Toolbar,
  Breadcrumbs,
  Link
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useSnackbar } from 'notistack'
import { Header, Sidebar } from '../../components/common'
import IncomeForm from '../../components/finances/IncomeForm'
import { IncomeFormData } from '../../types/finance.types'
import { createIncome } from '../../services/financeService'

const AddIncome = () => {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const drawerWidth = 240

  const handleSubmit = async (data: IncomeFormData) => {
    setSubmitting(true)
    try {
      await createIncome(data)
      enqueueSnackbar('Receita adicionada com sucesso', { variant: 'success' })
      navigate('/finances')
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao adicionar receita', { variant: 'error' })
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
              <Typography color="text.primary">Nova Receita</Typography>
            </Breadcrumbs>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h4">Nova Receita</Typography>
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
                <IncomeForm onSubmit={handleSubmit} isSubmitting={submitting} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default AddIncome