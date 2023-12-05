import { useEffect, useState } from "react"
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import BlogContentForm from "../../components/blog/BlogContentForm"

const API_URL = process.env.REACT_APP_API_URL

function ShelterBlogEdit() {
  const { token, userId } = useAuth()
  const [blogPost, setBlogPost] = useState(null)
  const [hero, setHero] = useState(null)
  const navigate = useNavigate()

  const url = window.location.href
  const urlSplit = url.split('/')
  const blogId = urlSplit[urlSplit.length - 2]

  useEffect(() => {
    fetch(`${API_URL}/api/blogposts/${blogId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json())
      .then(data => setBlogPost(data.data))
      .catch(err => console.log(err))
  }, [token, userId])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    if (hero) {
      formData.append('image', hero)
    }

    fetch(`${API_URL}/api/blogposts/${blogId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    }).then(res => res.json())
      .then(navigate(`/blog/${userId}/post/${blogId}`))
      .catch(err => console.log(err))
  }
  return (
    <BlogContentForm handleSubmit={handleSubmit} setHero={setHero} blogPost={blogPost} isCreate={false}/>
  )
}

export default ShelterBlogEdit