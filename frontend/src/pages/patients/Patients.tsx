import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useSnackbar } from 'notistack'
import { Header, Sidebar } from '../../components/common'
import PatientList from '../../components/patients/PatientList'
import { Patient } from '../../types/patient.types'
import { getPatients, deletePatient } from '../../services/patientService'

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, patientId: 0 })
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const drawerWidth = 240

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    setLoading(true)
    try {
      const data = await getPatients()
      setPatients(data)
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao carregar pacientes', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: number) => {
    setDeleteDialog({ open: true, patientId: id })
  }

  const handleDeleteConfirm = async () => {
    try {
      await deletePatient(deleteDialog.patientId)
      setPatients(patients.filter(patient => patient.id !== deleteDialog.patientId))
      enqueueSnackbar('Paciente excluído com sucesso', { variant: 'success' })
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao excluir paciente', { variant: 'error' })
    } finally {
      setDeleteDialog({ open: false, patientId: 0 })
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
            <Typography variant="h4">Pacientes</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/patients/add')}
            >
              Novo Paciente
            </Button>
          </Box>
          
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <PatientList 
                  patients={patients} 
                  onDeleteClick={handleDeleteClick} 
                />
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Dialog de confirmação para exclusão */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
      >
        <DialogTitle>Excluir paciente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita e 
            todas as sessões associadas a este paciente também serão excluídas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Patients