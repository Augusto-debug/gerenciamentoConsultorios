import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import NoteIcon from '@mui/icons-material/Note'
import { Patient } from '../../types/patient.types'
import { Session } from '../../types/session.types'
import { getSessionsByPatient } from '../../services/sessionService'
import { formatDate } from '../../utils/formatters'

interface PatientDetailsProps {
  patient: Patient
}

const PatientDetails = ({ patient }: PatientDetailsProps) => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessionsByPatient(patient.id)
        setSessions(data)
      } catch (error) {
        console.error('Erro ao buscar sessões do paciente:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSessions()
  }, [patient.id])

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            {patient.name}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {patient.email && (
              <Chip icon={<EmailIcon />} label={patient.email} variant="outlined" />
            )}
            {patient.phone && (
              <Chip icon={<PhoneIcon />} label={patient.phone} variant="outlined" />
            )}
            <Chip 
              icon={<CalendarTodayIcon />} 
              label={`Cadastro: ${formatDate(patient.createdAt)}`} 
              variant="outlined" 
            />
          </Box>
          
          {patient.notes && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <NoteIcon sx={{ mr: 1 }} /> Observações
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {patient.notes}
              </Typography>
            </Box>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Histórico de Sessões
              </Typography>
              <Button 
                variant="contained" 
                size="small"
                onClick={() => navigate('/sessions/add', { state: { patientId: patient.id } })}
              >
                Nova Sessão
              </Button>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : sessions.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                Nenhuma sessão registrada para este paciente.
              </Typography>
            ) : (
              <List disablePadding>
                {sessions.slice(0, 5).map((session) => (
                  <ListItem
                    key={session.id}
                    divider
                    component="button"
                    onClick={() => navigate(`/sessions/${session.id}`)}
                    alignItems="flex-start"
                  >
                    <ListItemText
                      primary={`Sessão em ${formatDate(session.date)}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Duração: {session.duration} minutos
                          </Typography>
                          {session.notes && (
                            <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                              {session.notes.length > 50
                                ? `${session.notes.substring(0, 50)}...`
                                : session.notes}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
            
            {sessions.length > 5 && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button onClick={() => navigate('/sessions', { state: { patientFilter: patient.id } })}>
                  Ver todas as sessões
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PatientDetails