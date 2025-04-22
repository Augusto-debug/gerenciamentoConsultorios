import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Toolbar,
  Breadcrumbs,
  Link,
  CircularProgress
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useSnackbar } from 'notistack'
import { Header, Sidebar } from '../../components/common'
import SessionForm from '../../components/sessions/SessionForm'
import { getSession, updateSession } from '../../services/sessionService'
import { SessionFormData } from '../../types/session.types'
interface SessionFormState {
  date: Date;
  duration: number;
  patientId: number;
  notes: string;
}

const EditSession = () => {
  const { id } = useParams<{ id: string }>()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sessionData, setSessionData] = useState<SessionFormState | null>(null)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const drawerWidth = 240

  useEffect(() => {
    if (id) {
      loadSession(parseInt(id))
    }
  }, [id])

  const loadSession = async (sessionId: number) => {
    try {
      const data = await getSession(sessionId)
      setSessionData({
        date: new Date(data.date), // Agora é do tipo Date corretamente
        duration: data.duration,
        patientId: data.patientId,
        notes: data.notes || ''
      })
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao carregar sessão', { 
        variant: 'error' 
      })
      navigate('/sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: SessionFormData) => {
    if (!id) return

    setIsSubmitting(true)
    try {
      await updateSession(parseInt(id), data)
      enqueueSnackbar('Sessão atualizada com sucesso', { variant: 'success' })
      navigate('/sessions')
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao atualizar sessão', { variant: 'error' })
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
              <Typography color="textPrimary">Editar Sessão</Typography>
            </Breadcrumbs>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h4">Editar Sessão</Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/sessions')}
            >
              Voltar
            </Button>
          </Box>
          
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8, lg: 6 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                sessionData && (
                  <Paper sx={{ p: 3 }}>
                    <SessionForm 
                      onSubmit={handleSubmit} 
                      initialData={sessionData}
                      isSubmitting={isSubmitting} 
                    />
                  </Paper>
                )
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default EditSession