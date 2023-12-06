import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'

const API_URL = process.env.REACT_APP_API_URL

export function useFetch(endpoint, settings, triggers, searchTerm, isPet = true) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        let queryString = endpoint.split('?').length > 1 ? endpoint.split('?')[1] : ''
        if (searchTerm && isPet) {
          const parseSearchArr = searchTerm.split(' ')
          let name = ''
          for (let i in parseSearchArr) {
            if(parseSearchArr[i].toLowerCase() === 'dog') queryString = queryString + (queryString !== '' ? '&category=D' : 'category=D')
            else if(parseSearchArr[i].toLowerCase() === 'cat') queryString = queryString + (queryString !== '' ? '&category=C' : 'category=C')
            else if(parseSearchArr[i].toLowerCase() === 'other') queryString = queryString + (queryString !== '' ? '&category=O' : 'category=O')
            else if(parseSearchArr[i].toLowerCase() === 'small') queryString = queryString + (queryString !== '' ? '&size=S' : 'size=S')
            else if(parseSearchArr[i].toLowerCase() === 'medium') queryString = queryString + (queryString !== '' ? '&size=M' : 'size=M')
            else if(parseSearchArr[i].toLowerCase() === 'large') queryString = queryString + (queryString !== '' ? '&size=L' : 'size=L')
            else if(parseSearchArr[i].toLowerCase() === 'male') queryString = queryString + (queryString !== '' ? '&gender=M' : 'gender=M')
            else if(parseSearchArr[i].toLowerCase() === 'female') queryString = queryString + (queryString !== '' ? '&gender=L' : 'gender=L')
            else if(parseSearchArr[i].toLowerCase() === 'available') queryString = queryString + (queryString !== '' ? '&status=AV' : 'status=AV')
            else if(parseSearchArr[i].toLowerCase() === 'adopted') queryString = queryString + (queryString !== '' ? '&status=AD' : 'status=AD')
            else if(parseSearchArr[i].toLowerCase() === 'pending') queryString = queryString + (queryString !== '' ? '&status=PE' : 'status=PE')
            else if(parseSearchArr[i].toLowerCase() === 'withdrawn') queryString = queryString + (queryString !== '' ? '&status=WI' : 'status=WI')
            else if(parseSearchArr[i].includes('@')) queryString = queryString + (queryString !== '' ? `&shelter_email=${parseSearchArr[i]}` : `shelter_email=${parseSearchArr[i]}`)
            else name = name + (name === '' ? parseSearchArr[i] : ("%20" + parseSearchArr[i]))
          }
          if(name !== '') queryString = queryString + (queryString !== '' ? `&name=${name}` : `name=${name}`)
        }
        const res = await fetch(`${API_URL}${isPet? (`${endpoint.split('?')[0]}?${queryString}`) : (endpoint)}`, settings)
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
  }, [endpoint, ...triggers, searchTerm])
  
  return { data, isLoading, status, error}
}