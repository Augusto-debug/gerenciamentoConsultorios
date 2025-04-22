import React, { createContext, useState, useEffect } from 'react'
import { loginUser } from '../services/authService'
import { User, LoginData } from '../types/auth.types'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

interface AuthContextProps {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  login: (data: LoginData) => Promise<void>
  logout: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  token: null,
  login: async () => {},
  logout: () => {},
  loading: true
})

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
    
    setLoading(false)
  }, [])

  const login = async (data: LoginData) => {
    try {
      setLoading(true)
      const response = await loginUser(data)
      const { user, access_token } = response

      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', access_token)
      
      setUser(user)
      setToken(access_token)
      
      enqueueSnackbar('Login realizado com sucesso!', { variant: 'success' })
      navigate('/dashboard')
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Erro ao fazer login', { variant: 'error' })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
    navigate('/login')
    enqueueSnackbar('Logout realizado com sucesso', { variant: 'info' })
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      token, 
      login, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}