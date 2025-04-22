import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ptBR } from 'date-fns/locale/pt-BR'
import { SessionFormData } from '../../types/session.types'
import { Patient } from '../../types/patient.types'
import { getPatients } from '../../services/patientService'

const schema = yup.object({
  date: yup.date()
    .required('Data é obrigatória'),
  duration: yup.number()
    .required('Duração é obrigatória')
    .min(15, 'A duração mínima é de 15 minutos')
    .max(240, 'A duração máxima é de 240 minutos'),
  patientId: yup.number()
    .required('Paciente é obrigatório')
    .positive('Paciente inválido'),
  notes: yup.string().nullable()
}).required()

// Defina um tipo específico para os valores do formulário
interface SessionFormValues {
  date: Date;  // Aqui é sempre Date
  duration: number;
  patientId: number;
  notes: string | null;
}

interface SessionFormProps {
  onSubmit: (data: SessionFormData) => Promise<void>
  initialData?: Omit<SessionFormData, 'date'> & { date?: string | Date }
  isSubmitting: boolean
  preSelectedPatientId?: number
}

const SessionForm = ({
  onSubmit,
  initialData,
  isSubmitting,
  preSelectedPatientId
}: SessionFormProps) => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientsLoading, setPatientsLoading] = useState(true)
  
  // Use o tipo SessionFormValues em vez de SessionFormData & { date: Date }
  const { control, register, handleSubmit, formState: { errors } } = useForm<SessionFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      // Converta explicitamente para Date
      date: initialData?.date 
        ? (typeof initialData.date === 'string' 
            ? new Date(initialData.date) 
            : initialData.date as Date)
        : new Date(),
      duration: initialData?.duration ?? 50,
      patientId: initialData?.patientId ?? preSelectedPatientId ?? 0,
      notes: initialData?.notes ?? ''
    }
  })

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients()
        setPatients(data)
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error)
      } finally {
        setPatientsLoading(false)
      }
    }

    fetchPatients()
  }, [])

  const submitHandler = (data: SessionFormValues) => {
    const formattedData: SessionFormData = {
      ...data,
      date: data.date.toISOString(), 
      notes: data.notes === null ? undefined : data.notes
    }
    onSubmit(formattedData)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Card>
        <CardContent>
          <Box component="form" noValidate onSubmit={handleSubmit(submitHandler)}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  control={control}
                  name="date"
                  render={({ field, fieldState }) => (
                    <DateTimePicker
                      label="Data e hora"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Duração (minutos)"
                  type="number"
                  inputProps={{ min: 15, max: 240 }}
                  {...register('duration')}
                  error={!!errors.duration}
                  helperText={errors.duration?.message}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth error={!!errors.patientId}>
                  <InputLabel>Paciente</InputLabel>
                  <Controller
                    name="patientId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Paciente"
                        disabled={patientsLoading || !!preSelectedPatientId}
                      >
                        {patientsLoading ? (
                          <MenuItem disabled value="">
                            Carregando pacientes...
                          </MenuItem>
                        ) : (
                          patients.map((patient) => (
                            <MenuItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    )}
                  />
                  {errors.patientId && (
                    <FormHelperText>{errors.patientId.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Observações"
                  multiline
                  rows={4}
                  {...register('notes')}
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  )
}

export default SessionForm