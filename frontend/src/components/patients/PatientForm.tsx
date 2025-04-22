import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material'
import { PatientFormData } from '../../types/patient.types'

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido').nullable(),
  phone: yup.string().nullable(),
  notes: yup.string().nullable()
}).required()

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => Promise<void>
  initialData?: PatientFormData
  isSubmitting: boolean
}

const PatientForm = ({ onSubmit, initialData, isSubmitting }: PatientFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PatientFormData>({
    resolver: yupResolver(schema) as any, // compatibilidade com novas versões do RHF
    defaultValues: initialData || {
      name: '',
      email: '',
      phone: '',
      notes: ''
    }
  })

  return (
    <Card>
      <CardContent>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nome completo"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Telefone"
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
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
  )
}

export default PatientForm