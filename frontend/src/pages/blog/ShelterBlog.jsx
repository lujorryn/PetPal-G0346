import { useAuth }from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react';

import BlogGallery from "../../components/blog/BlogGallery"

const API_URL = process.env.REACT_APP_API_URL

function ShelterBlog() {
  const { token, userId } = useAuth()
  const [blogPosts, setBlogPosts] = useState([])
  const [isOwner, setIsOwner] = useState(false)

  const navigate = useNavigate()
  const url = window.location.href
  const urlSplit = url.split('/')
  const blogUserId = urlSplit[urlSplit.length - 1]


  useEffect(() => {
    if (!token) return navigate('/login')
    
    if(blogUserId == userId) setIsOwner(true)

    fetch(`${API_URL}/api/blogposts/shelter/${blogUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then( res => res.json())
    .then( data => {
      if(data.error) return navigate('/')
      else setBlogPosts(data.results.data)
    })
    .catch( err => console.log("Error ", err))
  }, [token, navigate, blogUserId])

  return (
    <BlogGallery blogPosts={blogPosts} isOwner={isOwner}/>
  )
}

export default ShelterBlog