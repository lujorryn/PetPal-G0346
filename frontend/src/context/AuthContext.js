import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const API_URL = process.env.REACT_APP_API_URL

const AuthContext = createContext()


export const AuthProvider = ({children}) => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null)
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null)
  const [role, setRole] = useState(localStorage.getItem('role') || null)

  const checkUserRole = async (accessToken) => {
    const decodedToken = jwtDecode(accessToken)
    const { user_id } = decodedToken
    setUserId(user_id)
    localStorage.setItem('userId', user_id)

    try {
      const res = await fetch(`${API_URL}/api/shelters/${user_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!res.ok) {
        setRole('seeker')
        localStorage.setItem('role', 'seeker')
      } else {
        setRole('shelter')
        localStorage.setItem('role', 'shelter')
      }

    } catch (error) {
      console.log('error ', error);
    }
  }

  const login = async (accessToken, refreshToken) => {
    setToken(accessToken)
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    await checkUserRole(accessToken)
    navigate('/')
  }

  const logout = (dest='/login') => {
    setToken(null)
    setUserId(null)
    setRole(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    navigate(dest, { replace: true })
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