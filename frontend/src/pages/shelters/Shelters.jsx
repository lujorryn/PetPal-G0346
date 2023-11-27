import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

const API_URL = process.env.REACT_APP_API_URL

function Shelters() {
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return navigate('/login')

    fetch(`${API_URL}/api/shelters`)
    .then( res => res.json())
    .then( data => console.log(data))
    .catch( err => console.log("Error ", err))
  }, [token, navigate])
  
  return (
    <div>Shelters</div>
  )
}

export default Shelters