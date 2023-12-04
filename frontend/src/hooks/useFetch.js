import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'

const API_URL = process.env.REACT_APP_API_URL

export function useFetch(endpoint, settings) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`${API_URL}${endpoint}`, settings)

        if (!res.ok) throw new Error(res.status)
      
        const json = await res.json()
        setData(json)
        setStatus(res.status)
        setError(null)

      } catch (err) {
        const statusCode = Number(err.message)

        switch (statusCode) {
          case 401:
            setStatus(err)
            setError(null)
            setIsLoading(false)
            navigate('/login')
            break
          case 403:
            setStatus(err)
            setError(null)
            setIsLoading(false)
            navigate('/login')
            break
          default:
            setStatus(err)
            setError('There is a problem loading data.')
            break
        }
      } finally {
        setIsLoading(false)
      }
    }
  
    if (endpoint !== '') fetchData()
  }, [endpoint])
  
  return { data, isLoading, status, error}
}