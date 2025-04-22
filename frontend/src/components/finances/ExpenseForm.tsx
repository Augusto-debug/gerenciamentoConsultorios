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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ptBR } from 'date-fns/locale/pt-BR'
import { ExpenseFormData } from '../../types/finance.types'

// Define um tipo interno que usa Date ao invés de string para o campo date
interface ExpenseFormValues {
  amount: number;
  category: string;
  date: Date;
}

const schema = yup.object({
  amount: yup.number()
    .required('Valor é obrigatório')
    .positive('Valor deve ser positivo'),
  category: yup.string().required('Categoria é obrigatória'),
  date: yup.date().required('Data é obrigatória')
}).required();

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>
  initialData?: Partial<ExpenseFormValues>
  isSubmitting: boolean
}

const ExpenseForm = ({ onSubmit, initialData, isSubmitting }: ExpenseFormProps) => {
  // Use o tipo interno para o useForm
  const { control, register, handleSubmit, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: initialData?.amount || 0,
      category: initialData?.category || '',
      date: initialData?.date || new Date()
    }
  });

  const categories = [
    'Aluguel',
    'Contas',
    'Material de Escritório',
    'Marketing',
    'Software',
    'Impostos',
    'Outros'
  ];

  // Converte os valores do formulário para o formato esperado pela API
  const submitHandler = (data: ExpenseFormValues) => {
    const formattedData: ExpenseFormData = {
      ...data,
      date: data.date.toISOString(),
    };
    onSubmit(formattedData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Card>
        <CardContent>
          <Box component="form" noValidate onSubmit={handleSubmit(submitHandler)}>
            <Grid container spacing={2}>
              {/* Usando size=6 (metade da largura) para campos lado a lado */}
              <Grid size={6}>
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
              
              <Grid size={6}>
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
              
              {/* Usando size=12 (largura total) para campo de categoria */}
              <Grid size={12}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Categoria</InputLabel>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Categoria"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <FormHelperText>{errors.category.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              {/* Usando size=12 (largura total) para botão de submit */}
              <Grid size={12}>
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
  );
};

export default ExpenseForm;