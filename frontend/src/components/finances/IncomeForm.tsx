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
  CardContent
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {ptBR} from 'date-fns/locale/pt-BR'
import { IncomeFormData } from '../../types/finance.types'

interface IncomeFormValues {
  amount: number;
  source: string;
  date: Date;
}

const schema = yup.object({
  amount: yup.number()
    .required('Valor é obrigatório')
    .positive('Valor deve ser positivo'),
  source: yup.string().required('Origem é obrigatória'),
  date: yup.date().required('Data é obrigatória')
}).required()

interface IncomeFormProps {
  onSubmit: (data: IncomeFormData) => Promise<void>
  initialData?: Partial<IncomeFormValues>
  isSubmitting: boolean
}

const IncomeForm = ({ onSubmit, initialData, isSubmitting }: IncomeFormProps) => {
  const { control, register, handleSubmit, formState: { errors } } = useForm<IncomeFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: initialData?.amount || 0,
      source: initialData?.source || '',
      date: initialData?.date || new Date()
    }
  })

  const submitHandler = (data: IncomeFormValues) => {
    const formattedData: IncomeFormData = {
      ...data,
      date: data.date.toISOString(),
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
                <TextField
                  fullWidth
                  label="Valor (R$)"
                  type="number"
                  inputProps={{
                    step: "0.01",
                    min: "0"
                  }}
                  {...register('amount')}
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  control={control}
                  name="date"
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label="Data"
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
              <Grid size={{ xs: 12, md: 12 }}>
                <TextField
                  fullWidth
                  label="Origem"
                  {...register('source')}
                  error={!!errors.source}
                  helperText={errors.source?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
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

export default IncomeForm