import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPatient } from '../../services/patientService'
import {
  Box,
  Container,
  Typography,
  Toolbar,
  Breadcrumbs,
  Link
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { Header, Sidebar } from '../../components/common'
import PatientForm from '../../components/patients/PatientForm'
import { PatientFormData } from '../../types/patient.types'

const AddPatient = () => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const drawerWidth = 240

  const handleSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true)
    try {
      await createPatient(data)
      enqueueSnackbar('Paciente cadastrado com sucesso', { variant: 'success' })
      navigate('/patients')
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao cadastrar paciente', { variant: 'error' })
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
            <Typography color="textPrimary">Novo Paciente</Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" sx={{ mb: 4 }}>
            Novo Paciente
          </Typography>
          
          <PatientForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </Container>
      </Box>
    </Box>
  )
}

export default AddPatient