import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPatient, updatePatient } from '../../services/patientService'
import {
  Box,
  Container,
  Typography,
  Toolbar,
  Breadcrumbs,
  Link,
  CircularProgress
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { Header, Sidebar } from '../../components/common'
import PatientForm from '../../components/patients/PatientForm'
import { PatientFormData } from '../../types/patient.types'

const EditPatient = () => {
  const { id } = useParams<{ id: string }>()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [patientData, setPatientData] = useState<PatientFormData | null>(null)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const drawerWidth = 240

  useEffect(() => {
    if (id) {
      loadPatient(parseInt(id))
    }
  }, [id])

  const loadPatient = async (patientId: number) => {
    try {
      const patient = await getPatient(patientId)
      setPatientData({
        name: patient.name,
        email: patient.email || '',
        phone: patient.phone || '',
        notes: patient.notes || ''
      })
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao buscar dados do paciente', { 
        variant: 'error' 
      })
      navigate('/patients')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: PatientFormData) => {
    if (!id) return

    setIsSubmitting(true)
    try {
      await updatePatient(parseInt(id), data)
      enqueueSnackbar('Paciente atualizado com sucesso', { variant: 'success' })
      navigate('/patients')
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao atualizar paciente', { variant: 'error' })
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
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link component={RouterLink} to="/dashboard" color="inherit">
              Dashboard
            </Link>
            <Link component={RouterLink} to="/patients" color="inherit">
              Pacientes
            </Link>
            <Typography color="textPrimary">Editar Paciente</Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" sx={{ mb: 4 }}>
            Editar Paciente
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            patientData && (
              <PatientForm 
                onSubmit={handleSubmit} 
                initialData={patientData}
                isSubmitting={isSubmitting}
              />
            )
          )}
        </Container>
      </Box>
    </Box>
  )
}

export default EditPatient