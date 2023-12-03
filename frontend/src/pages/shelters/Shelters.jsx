import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

const API_URL = process.env.REACT_APP_API_URL

function Shelters() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [shelters, setShelters] = useState([])

  useEffect(() => {
    if (!token) return navigate('/login')

    const getShelters = async () => {
      try {
        var results = []
        var nextPage = `${API_URL}/api/shelters`
        var pageNum = 1
        while (nextPage) {
          const res = await fetch(nextPage, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const data = await res.json()
          results.push(...data.data)
          if (data.page.has_next) {
            nextPage = nextPage + '?page=' + (pageNum + 1)
            pageNum++
          } else {
            setShelters(results)
            break
          }
        }
    } catch (err) {
        console.log(err)
      }
    }
    getShelters()
  }, [token, navigate])
  
  return (
    <div className="container w-[90%] mb-16">
      <h1 className="text-5xl font-bold text-gray-900 my-8">Shelters:</h1>
      <div className="mx-auto block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
          <p className="text-base text-neutral-600 dark:text-neutral-200">
              🏡 Explore our list of pet shelters, each representing a sanctuary of hope for animals in need of new owners! These shelters, both large and cozy, are staffed by dedicated individuals committed to providing love and care to our pets. Here, you'll find a diverse array of dogs, cats, and other wonderful creatures waiting to find their forever families. When you adopt from our shelters, you're not just gaining a pet; you're becoming a hero, offering a lifeline to an animal in need. So, take your time, browse through our shelters, and let your heart guide you to your new best friend. Your journey of companionship and compassion begins here! 🐾❤️</p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mb-4 mt-16">
        {shelters?.map((shelter) => (
          <div className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700" key={shelter.id}>
            <a href={`/profile/${shelter.id}`} className="group">
                <img
                alt={`shelter${shelter.id}`}
                className="block h-64 w-full rounded-lg object-cover object-center"
                src={shelter?.avatar ? `${API_URL}/${shelter.avatar}` : "/images/logo_ref.png"}
                />
            </a>
            <p className="mt-4 text-base text-neutral-600 dark:text-neutral-200 text-center">
                {shelter.name}
            </p>
          </div>
        ))}
      </div>
  </div>
  )
}

export default Shelters