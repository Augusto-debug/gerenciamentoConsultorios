import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Toolbar,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useSnackbar } from 'notistack'
import Header from '../../components/common/Header'
import Sidebar from '../../components/common/Sidebar'
import FinanceSummary from '../../components/finances/FinanceSummary'
import {
  getIncomes,
  getExpenses,
  deleteIncome,
  deleteExpense
} from '../../services/financeService'
import { Income, Expense } from '../../types/finance.types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const Finances = () => {
  const [open, setOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [incomes, setIncomes] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: number, type: 'income' | 'expense' } | null>(null)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const drawerWidth = 240

  useEffect(() => {
    if (tabValue === 0) {
      fetchIncomes()
    } else {
      fetchExpenses()
    }
  }, [tabValue])

  const fetchIncomes = async () => {
    setLoading(true)
    try {
      const data = await getIncomes()
      setIncomes(data)
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao buscar receitas', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const data = await getExpenses()
      setExpenses(data)
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao buscar despesas', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleDeleteClick = (id: number, type: 'income' | 'expense') => {
    setItemToDelete({ id, type })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    try {
      if (itemToDelete.type === 'income') {
        await deleteIncome(itemToDelete.id)
        setIncomes(incomes.filter(i => i.id !== itemToDelete.id))
        enqueueSnackbar('Receita excluída com sucesso', { variant: 'success' })
      } else {
        await deleteExpense(itemToDelete.id)
        setExpenses(expenses.filter(e => e.id !== itemToDelete.id))
        enqueueSnackbar('Despesa excluída com sucesso', { variant: 'success' })
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || `Erro ao excluir ${itemToDelete.type === 'income' ? 'receita' : 'despesa'}`, {
        variant: 'error'
      })
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
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
          <Typography variant="h4" sx={{ mb: 4 }}>
            Finanças
          </Typography>

          <Grid container spacing={4}>
            <Grid>
              <FinanceSummary />
            </Grid>
            <Grid>
              <Paper>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                  <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab
                      icon={<ArrowUpwardIcon />}
                      iconPosition="start"
                      label="Receitas"
                    />
                    <Tab
                      icon={<ArrowDownwardIcon />}
                      iconPosition="start"
                      label="Despesas"
                    />
                  </Tabs>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(tabValue === 0 ? '/finances/income/add' : '/finances/expense/add')}
                  >
                    {tabValue === 0 ? 'Nova Receita' : 'Nova Despesa'}
                  </Button>
                </Box>

                <Box sx={{ p: 2 }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : tabValue === 0 ? (
                    incomes.length === 0 ? (
                      <Typography variant="subtitle1" sx={{ py: 4, textAlign: 'center' }}>
                        Nenhuma receita registrada. Clique em "Nova Receita" para adicionar.
                      </Typography>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Data</TableCell>
                              <TableCell>Origem</TableCell>
                              <TableCell align="right">Valor</TableCell>
                              <TableCell align="center">Ações</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {incomes.map((income) => (
                              <TableRow key={income.id}>
                                <TableCell>{formatDate(income.date)}</TableCell>
                                <TableCell>{income.source}</TableCell>
                                <TableCell align="right">
                                  {formatCurrency(income.amount)}
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDeleteClick(income.id, 'income')}
                                    size="small"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )
                  ) : (
                    expenses.length === 0 ? (
                      <Typography variant="subtitle1" sx={{ py: 4, textAlign: 'center' }}>
                        Nenhuma despesa registrada. Clique em "Nova Despesa" para adicionar.
                      </Typography>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Data</TableCell>
                              <TableCell>Categoria</TableCell>
                              <TableCell align="right">Valor</TableCell>
                              <TableCell align="center">Ações</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {expenses.map((expense) => (
                              <TableRow key={expense.id}>
                                <TableCell>{formatDate(expense.date)}</TableCell>
                                <TableCell>{expense.category}</TableCell>
                                <TableCell align="right">
                                  {formatCurrency(expense.amount)}
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDeleteClick(expense.id, 'expense')}
                                    size="small"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta {itemToDelete?.type === 'income' ? 'receita' : 'despesa'}?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Finances