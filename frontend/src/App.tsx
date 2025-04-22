import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import PrivateRoute from './components/common/PrivateRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Patients from './pages/patients/Patients'
import AddPatient from './pages/patients/AddPatient'
import EditPatient from './pages/patients/EditPatient'
import Sessions from './pages/sessions/Sessions'
import AddSession from './pages/sessions/AddSession'
import EditSession from './pages/sessions/EditSession'
import Finances from './pages/finances/Finances'
import AddIncome from './pages/finances/AddIncome'
import AddExpense from './pages/finances/AddExpense'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        {/* Patient Routes */}
        <Route path="/patients" element={<PrivateRoute><Patients /></PrivateRoute>} />
        <Route path="/patients/add" element={<PrivateRoute><AddPatient /></PrivateRoute>} />
        <Route path="/patients/:id" element={<PrivateRoute><EditPatient /></PrivateRoute>} />

        {/* Session Routes */}
        <Route path="/sessions" element={<PrivateRoute><Sessions /></PrivateRoute>} />
        <Route path="/sessions/add" element={<PrivateRoute><AddSession /></PrivateRoute>} />
        <Route path="/sessions/:id" element={<PrivateRoute><EditSession /></PrivateRoute>} />

        {/* Finance Routes */}
        <Route path="/finances" element={<PrivateRoute><Finances /></PrivateRoute>} />
        <Route path="/finances/income/add" element={<PrivateRoute><AddIncome /></PrivateRoute>} />
        <Route path="/finances/expense/add" element={<PrivateRoute><AddExpense /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
