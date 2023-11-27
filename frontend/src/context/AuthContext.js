import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const API_URL = process.env.REACT_APP_API_URL

const AuthContext = createContext()


export const AuthProvider = ({children}) => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null)
  const [userId, setUserId] = useState(null)
  const [role, setRole] = useState(null)

  const checkUserRole = async (accessToken) => {
    const decodedToken = jwtDecode(accessToken)
    const { user_id} = decodedToken
    setUserId(user_id)

    try {
      const res = await fetch(`${API_URL}/api/shelters/${user_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!res.ok) return setRole('seeker')

      setRole('shelter')

    } catch (error) {
      console.log('error ', error);
    }
  }

  const login = (accessToken, refreshToken) => {
    setToken(accessToken)
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    checkUserRole(accessToken)
    navigate('/')
  }

  const logout = () => {
    setToken(null)
    setUserId(null)
    setRole(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/login')
  }

  return(
    <AuthContext.Provider value={{
      token,
      userId,
      role,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}