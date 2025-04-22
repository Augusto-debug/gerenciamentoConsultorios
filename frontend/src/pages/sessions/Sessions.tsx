import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { getSessions, deleteSession, getSessionsByPatient } from '../../services/sessionService'
import { getPatient } from '../../services/patientService'
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Toolbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Chip,
  Breadcrumbs,
  Link
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSnackbar } from 'notistack'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Header, Sidebar } from '../../components/common'
import { Session } from '../../types/session.types'
import { Patient } from '../../types/patient.types'

const Sessions = () => {
  const [open, setOpen] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null)
  const [patientFilter, setPatientFilter] = useState<Patient | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const drawerWidth = 240

  const query = new URLSearchParams(location.search)
  const patientId = query.get('patient')

  useEffect(() => {
    if (patientId) {
      fetchPatientData(parseInt(patientId))
      fetchSessionsByPatient(parseInt(patientId))
    } else {
      fetchAllSessions()
    }
  }, [patientId])

  const fetchPatientData = async (id: number) => {
    try {
      const patient = await getPatient(id)
      setPatientFilter(patient)
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao buscar dados do paciente', { variant: 'error' })
    }
  }

  const fetchAllSessions = async () => {
    try {
      const data = await getSessions()
      setSessions(data)
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao buscar sessões', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchSessionsByPatient = async (id: number) => {
    try {
      const data = await getSessionsByPatient(id)
      setSessions(data)
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao buscar sessões do paciente', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (session: Session) => {
    setSessionToDelete(session)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return

    try {
      await deleteSession(sessionToDelete.id)
      setSessions(sessions.filter(s => s.id !== sessionToDelete.id))
      enqueueSnackbar('Sessão excluída com sucesso', { variant: 'success' })
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao excluir sessão', { variant: 'error' })
    } finally {
      setDeleteDialogOpen(false)
      setSessionToDelete(null)
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
          {patientFilter && (
            <Breadcrumbs sx={{ mb: 2 }}>
              <Link component={RouterLink} to="/dashboard" color="inherit">
                Dashboard
              </Link>
              <Link component={RouterLink} to="/patients" color="inherit">
                Pacientes
              </Link>
              <Typography color="textPrimary">Sessões de {patientFilter.name}</Typography>
            </Breadcrumbs>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
            <Box>
              <Typography variant="h4">
                {patientFilter 
                  ? `Sessões de ${patientFilter.name}` 
                  : 'Todas as Sessões'
                }
              </Typography>
              {patientFilter && (
                <Button 
                  sx={{ mt: 1 }}
                  component={RouterLink} 
                  to="/sessions"
                  size="small"
                >
                  Ver todas as sessões
                </Button>
              )}
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => navigate(patientId ? `/sessions/add?patient=${patientId}` : '/sessions/add')}
            >
              Nova Sessão
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    {!patientFilter && <TableCell>Paciente</TableCell>}
                    <TableCell>Duração</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={patientFilter ? 4 : 5} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Nenhuma sessão encontrada
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sessions.map((session) => {
                      const sessionDate = new Date(session.date)
                      const isPast = sessionDate < new Date()
                      
                      return (
                        <TableRow key={session.id}>
                          <TableCell>
                            {format(sessionDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </TableCell>
                          
                          {!patientFilter && (
                            <TableCell>{session.patient?.name}</TableCell>
                          )}
                          
                          <TableCell>{session.duration} min</TableCell>
                          
                          <TableCell>
                            <Chip 
                              size="small"
                              label={isPast ? "Realizada" : "Agendada"}
                              color={isPast ? "success" : "primary"}
                            />
                          </TableCell>
                          
                          <TableCell align="center">
                            <IconButton 
                              color="primary" 
                              onClick={() => navigate(`/sessions/${session.id}`)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              color="error"
                              onClick={() => handleDeleteClick(session)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
        
        {/* Dialog de confirmação de exclusão */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir esta sessão? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default Sessions