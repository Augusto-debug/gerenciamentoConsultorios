import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Sidebar } from '../../components/common'
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Toolbar,
  CircularProgress
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import EventNoteIcon from '@mui/icons-material/EventNote'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { fetchDashboardData } from '../../services/dashboardService'

interface DashboardData {
  patientCount: number
  upcomingSessions: number
  monthlyIncome: number
}

const Dashboard = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData>({
    patientCount: 0,
    upcomingSessions: 0,
    monthlyIncome: 0
  })
  const navigate = useNavigate()
  const drawerWidth = 240

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboardData = await fetchDashboardData()
        setData(dashboardData)
      } catch (error) {
        console.error('Erro ao carregar o dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

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
        
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4 }}>
            Dashboard
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={4}>
                {/* Cards com resumo */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          Pacientes
                        </Typography>
                        <Typography variant="h3" color="primary" sx={{ mt: 2 }}>
                          {data.patientCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total de pacientes cadastrados
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          startIcon={<PersonAddIcon />}
                          onClick={() => navigate('/patients/add')}
                        >
                          Adicionar paciente
                        </Button>
                      </CardActions>
                    </Card>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper elevation={3} sx={{ height: '100%' }}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          Próximas sessões
                        </Typography>
                        <Typography variant="h3" color="primary" sx={{ mt: 2 }}>
                          {data.upcomingSessions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sessões agendadas para os próximos 7 dias
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          startIcon={<EventNoteIcon />}
                          onClick={() => navigate('/sessions/add')}
                        >
                          Agendar sessão
                        </Button>
                      </CardActions>
                    </Card>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper elevation={3} sx={{ height: '100%' }}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          Receita deste mês
                        </Typography>
                        <Typography variant="h3" color="primary" sx={{ mt: 2 }}>
                          {data.monthlyIncome.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total de receitas no mês atual
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          startIcon={<TrendingUpIcon />}
                          onClick={() => navigate('/finances')}
                        >
                          Ver finanças
                        </Button>
                      </CardActions>
                    </Card>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </Box>
  )
}

export default Dashboard