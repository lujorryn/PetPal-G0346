import { useAuth }from '../../context/AuthContext'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'

import BlogHero from "../../components/blog/BlogHero"
import BlogContent from '../../components/blog/BlogContent';

const API_URL = process.env.REACT_APP_API_URL

function ShelterBlogPost() {
  const { token, userId } = useAuth()
  const [blogPost, setBlogPost] = useState({})
  const [isOwner, setIsOwner] = useState(false)
  const navigate = useNavigate()
  const url = window.location.href
  const urlSplit = url.split('/')
  const blogId = urlSplit[urlSplit.length - 1]
  const blogOwnerId = urlSplit[urlSplit.length - 3]

  const handleDelete = (e) => {
    e.preventDefault()
    fetch(`${API_URL}/api/blogposts/${blogId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => { res.json() })
      .then(navigate(`/blog/${userId}`))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    if (!token) return navigate('/login')

    if(blogOwnerId == userId) setIsOwner(true)

    fetch(`${API_URL}/api/blogposts/${blogId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then( res => res.json())
    .then( data => {
      if(data.error) return navigate(`/blog/${blogOwnerId}`)
      else setBlogPost(() => data.data)
    })
    .catch( err => console.log("Error ", err))
  }, [token, navigate, blogId, blogOwnerId])

  return (
    <div>
      <BlogHero imgSrc={blogPost.image}/>
      <BlogContent 
        title={blogPost.title}
        author={blogPost.author}
        created_date={blogPost.created_time ? blogPost.created_time.slice(0, 10) : ''}
        updated_date={blogPost.last_updated ? blogPost.last_updated.slice(0, 10) : ''}
        content_list={blogPost.content ? blogPost.content.split('\n') : []}
        isOwner={isOwner}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default ShelterBlogPost