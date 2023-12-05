import { useState } from "react"
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import BlogContentForm from "../../components/blog/BlogContentForm"

const API_URL = process.env.REACT_APP_API_URL

function ShelterBlogCreate() {
  const { token, userId } = useAuth()
  const [hero, setHero] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    if (hero) {
      formData.append('image', hero)
    }

    fetch(`${API_URL}/api/blogposts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    }).then(res => res.json())
      .then(navigate(`/blog/${userId}`))
      .catch(err => console.log(err))
  }
  return (
    <BlogContentForm handleSubmit={handleSubmit} setHero={setHero}/>
  )
}

export default ShelterBlogCreate