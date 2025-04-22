import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  IconButton,
  TablePagination,
  Tooltip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EventIcon from '@mui/icons-material/Event'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Patient } from '../../types/patient.types'
import { Session } from '../../types/session.types'
import { formatDateTime } from '../../utils/formatters'

interface SessionListProps {
  sessions: Session[]
  patients: Patient[]
  onDeleteClick: (id: number) => void
}

const SessionList = ({ sessions, patients, onDeleteClick }: SessionListProps) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [patientFilter, setPatientFilter] = useState<number | ''>('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredSessions = sessions.filter(session => {
    // Filtro por paciente
    if (patientFilter && session.patientId !== patientFilter) {
      return false
    }

    // Filtro por termo de busca
    const patientName = session.patient?.name || ''
    const notes = session.notes || ''
    
    if (searchTerm && 
        !patientName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !notes.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    return true
  })

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const displayedSessions = filteredSessions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <Box>
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        gap: 2,
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        <TextField
          fullWidth
          placeholder="Buscar sessões..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Filtrar por paciente</InputLabel>
          <Select
            value={patientFilter}
            label="Filtrar por paciente"
            onChange={(e) => setPatientFilter(e.target.value as number | '')}
          >
            <MenuItem value="">Todos</MenuItem>
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {displayedSessions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Nenhuma sessão encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || patientFilter 
              ? "Tente remover os filtros aplicados." 
              : "Adicione sua primeira sessão."}
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data e Hora</TableCell>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Duração</TableCell>
                  <TableCell>Anotações</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{formatDateTime(session.date)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={session.patient?.name || '?'} 
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={() => navigate(`/patients/${session.patientId}`)}
                      />
                    </TableCell>
                    <TableCell>{session.duration} min</TableCell>
                    <TableCell>
                      {session.notes
                        ? session.notes.length > 50
                          ? `${session.notes.substring(0, 50)}...`
                          : session.notes
                        : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Editar">
                          <IconButton 
                            size="small"
                            onClick={() => navigate(`/sessions/${session.id}`)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDeleteClick(session.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredSessions.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Itens por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </>
      )}
    </Box>
  )
}

export default SessionList