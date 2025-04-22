import { useState } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
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
import SessionForm from '../../components/sessions/SessionForm'
import { createSession } from '../../services/sessionService'
import { SessionFormData } from '../../types/session.types'

const AddSession = () => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const drawerWidth = 240

  const query = new URLSearchParams(location.search)
  const patientId = query.get('patient')
  const preSelectedPatientId = patientId ? parseInt(patientId) : undefined

  const handleSubmit = async (data: SessionFormData) => {
    setIsSubmitting(true)
    try {
      await createSession(data)
      enqueueSnackbar('Sessão agendada com sucesso', { variant: 'success' })
      navigate(patientId ? `/sessions?patient=${patientId}` : '/sessions')
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao agendar sessão', { variant: 'error' })
    } finally {
      setIsSubmitting(false)
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
                component={RouterLink} 
                to="/dashboard"
              >
                Dashboard
              </Link>
              <Link 
                color="inherit" 
                component={RouterLink} 
                to="/sessions"
              >
                Sessões
              </Link>
              <Typography color="textPrimary">Nova Sessão</Typography>
            </Breadcrumbs>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h4">Nova Sessão</Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(patientId ? `/sessions?patient=${patientId}` : '/sessions')}
            >
              Voltar
            </Button>
          </Box>
          
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8, lg: 6 }}>
              <Paper sx={{ p: 3 }}>
                <SessionForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting} 
                  preSelectedPatientId={preSelectedPatientId}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default AddSession