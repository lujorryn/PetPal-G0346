import { useAuth }from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react';

import BlogGallery from "../../components/blog/BlogGallery"
import Pagination from '../../components/ui/Pagination';

const API_URL = process.env.REACT_APP_API_URL

function ShelterBlog() {
  const { token, userId } = useAuth()
  const [blogPosts, setBlogPosts] = useState([])
  const [isOwner, setIsOwner] = useState(false)

  const navigate = useNavigate()
  const url = window.location.href
  const urlSplit = url.split('/')
  const blogUserId = urlSplit[urlSplit.length - 1]

  const [next, setNext] = useState(null)
  const [prev, setPrev] = useState(null)
  const [curr, setCurr] = useState(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!token) return navigate('/login')
    
    if(blogUserId == userId) setIsOwner(true)

    fetch(`${API_URL}/api/blogposts/shelter/${blogUserId}?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then( res => res.json())
    .then( data => {
      if(data.error) return navigate('/')
      else {
        setNext(data.next)
        setPrev(data.previous)
        setCurr(data.current_page)
        setTotal(data.total_pages)
        setBlogPosts(data.results.data)
      }
    })
    .catch( err => console.log("Error ", err))
  }, [token, navigate, blogUserId, page])

  return (
    <div style={{ marginBottom: 'var(--margin-wide)'}}>
      <BlogGallery blogPosts={blogPosts} isOwner={isOwner}/>
      <Pagination next={next} prev={prev} curr={curr} total_pages={total} setPage={setPage}/>
    </div>
  )
}

export default ShelterBlog