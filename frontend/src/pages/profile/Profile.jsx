import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Profile.css'
import '../../styles/tailwind.css'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const { token, userId, role } = useAuth()
  const [user, setUser] = useState(null)
  const [shelterPets, setShelterPets] = useState(null)
  const [favPets, setFavPets] = useState(null)
  const [reviews, setReviews] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return navigate('/login')
    // Fetch user data
    fetch(`${process.env.REACT_APP_API_URL}/api/${role}s/${userId}`, { // TODO: Change to /api/seekers/${userId
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.log(err))
    
    // Different fetches for different roles
    const fetchUserData = async () => {
      try {
        if (role === 'shelter') {
          const data = await getShelterPets()
          setShelterPets(data)
          const reviews = await getReviews()
          setReviews(reviews)
        } else if (role === 'seeker') {
          const data = await getFavPets()
          setFavPets(data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const getReviews = async () => {
      let nextPage = `${process.env.REACT_APP_API_URL}/api/comments/shelter/${userId}`
      const allResults = []
      var pageNum = 1
      try {
        while (nextPage) {
          const response = await fetch(nextPage, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          const data = await response.json()
          allResults.push(...data.data)
          if (data.page.has_next) {
            nextPage = `${process.env.REACT_APP_API_URL}/api/comments/shelter/${userId}?page=${pageNum + 1}`
            pageNum += 1
          } else {
            break
          }
        }
        console.log(allResults)
        return allResults
      } catch (error) {
        console.error(error)
      }
    }

    const getShelterPets = async () => {
      var nextPage = `${process.env.REACT_APP_API_URL}/api/petlistings/shelter/${user?.data.email}`
      const allResults = []
    
      try {
        while (nextPage) {
          const response = await fetch(nextPage, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
    
          const data = await response.json()
          allResults.push(...data.results.data)
          nextPage = data.next
        }
        return allResults
      } catch (error) {
        console.error(error)
      }
    }

    const getFavPets = async () => {
      let nextPage = `${process.env.REACT_APP_API_URL}/api/seekers/${userId}/favorites`
      const allResults = []
      var pageNum = 1
      try {
        while (nextPage) {
          const response = await fetch(nextPage, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          const data = await response.json()
          allResults.push(...data.data)
          if (data.page.has_next) {
            nextPage = `${process.env.REACT_APP_API_URL}/api/seekers/${userId}/favorites?page=${pageNum + 1}`
            pageNum += 1
          } else {
            break
          }
        }
        return allResults
      } catch (error) {
        console.error(error)
      }
    }

    fetchUserData()
  }, [token, userId, role, navigate, user?.data.email])

  const handleReply = (is_author_seeker, seeker, shelter, e) => {
    // Get the input field's content
    const reviewBox = e.target.closest('.review-box')
    const input = reviewBox.querySelector('input')
    const content = input.value
    console.log(content)
    console.log(is_author_seeker, seeker, shelter)

    fetch(`${process.env.REACT_APP_API_URL}/api/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        is_review: true,
        content: content,
        recipient_email: is_author_seeker ? seeker : shelter,
        rating: null,
        application_id: null,
      })
    }).then(res => res.json())
      .then(data => window.location.reload())
      .catch(err => console.log(err))
  }


  const renderProfile = () => {
    if (role === 'seeker') {
      return (
        <div class='profile-grid'>
          <div class='profile-img'>
              <div class='profile-container'>
                <img class='rounded-full w-full h-full' src={user?.data.avatar? `${process.env.REACT_APP_API_URL}${user?.data.avatar}` : '../../../images/logo_ref.png'} alt='../../../images/logo_ref.png' />
              </div>
              <a href='profile/edit' class='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full'>Edit Profile</a>
          </div>
          <div class='profile-desc'>
            <p class='font-semibold text-5xl break-all'>Your Profile</p>
            <hr class='line'></hr>
            <ul class='profile-list'>
              <li>
                <span class='font-bold'>Email:</span>
                <span class='text-gray-700'>
                  <a href={`mailto:${user?.data.email}`}>{user?.data.email}</a>
                </span>
              </li>
              <li>
                <span class='font-bold'>Adress:</span>
                <span class='text-gray-700'>
                  <p>{user?.data.address === '' ? 'N/A' : user?.data.address}</p>
                </span>
              </li>
              <li>
                <span class='font-bold'>Postal Code:</span>
                <span class='text-gray-700'>
                  <p>{user?.data.postal_code === '' ? 'N/A' : user?.data.postal_code}</p>
                </span>
              </li>
              <li>
                <span class='font-bold'>City:</span>
                <span class='text-gray-700'>
                  <p>{user?.data.city === '' ? 'N/A' : user?.data.city}</p>
                </span>
              </li>
              <li>
                <span class='font-bold'>Province:</span>
                <span class='text-gray-700'>
                  <p>{user?.data.province === '' ? 'N/A' : user?.data.province}</p>
                </span>
              </li>
              <li>
                <span class='font-bold'>Phone:</span>
                <span class='text-gray-700'>
                  <p>{user?.data.phone === '' ? 'N/A' : user?.data.phone}</p>
                </span>
              </li>
              <li>
                <a class='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-full' href='applications'>My Applications</a>
              </li>
            </ul>
          </div>
          <div class='profile-favs'>
            <div className='container mx-auto mb-4 px-5 py-2 lg:px-32 lg:pt-12 space-y-4'>
              <p className='text-xl font-bold'>Your Favorites</p>
              <div className='-m-1 flex flex-wrap md:-m-2'>
                {favPets?.map((pet) => (
                  <div className='flex w-full md:w-1/2 lg:w-1/3 p-1 md:p-2'>
                    <a href={`/petlistings/${pet.id}`} className='w-full block'>
                      <img
                        alt={pet.name}
                        className='block w-full h-64 object-cover object-center rounded-lg'
                        src={pet.photos[0] ? `${process.env.REACT_APP_API_URL}${pet.photos[0].url}` : '../../../images/logo_ref.png'}
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div class='profile-grid'>
            <div class='profile-img'>
                <div class='profile-container'>
                  <img class='rounded-full w-full h-full' src={user?.data.avatar? `${process.env.REACT_APP_API_URL}${user?.data.avatar}` : '../../../images/logo_ref.png'} alt='../../../images/logo_ref.png' />
                </div>
                <a href='profile/edit' class='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full'>Edit Profile</a>
            </div>
            <div class='profile-desc'>
              <p class='font-semibold text-5xl break-all'>Your Profile</p>
              <div class="flex items-center">
                {user?.data.avg_rating === 0 ? (
                  <span>No Rating</span>
                ) : (
                  <div class="flex items-center">
                    {Array.from({ length: user?.data.avg_rating }, (_, index) => (
                      <svg
                        key={index}
                        class="w-4 h-4 text-yellow-300 me-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                      </svg>
                    ))}
                    {user?.data.avg_rating} out of 5
                  </div>
                )}
              </div>
              <hr class='line'></hr>
              <ul class='profile-list'>
                <li>
                  <span class='font-bold'>Email:</span>
                  <span class='text-gray-700'>
                    <a href={`mailto:${user?.data.email}`}>{user?.data.email}</a>
                  </span>
                </li>
                <li>
                  <span class='font-bold'>Adress:</span>
                  <span class='text-gray-700'>
                    <p>{user?.data.address === '' ? 'N/A' : user?.data.address}</p>
                  </span>
                </li>
                <li>
                  <span class='font-bold'>Postal Code:</span>
                  <span class='text-gray-700'>
                    <p>{user?.data.postal_code === '' ? 'N/A' : user?.data.postal_code}</p>
                  </span>
                </li>
                <li>
                  <span class='font-bold'>City:</span>
                  <span class='text-gray-700'>
                    <p>{user?.data.city === '' ? 'N/A' : user?.data.city}</p>
                  </span>
                </li>
                <li>
                  <span class='font-bold'>Province:</span>
                  <span class='text-gray-700'>
                    <p>{user?.data.province === '' ? 'N/A' : user?.data.province}</p>
                  </span>
                </li>
                <li>
                  <span class='font-bold'>Phone:</span>
                  <span class='text-gray-700'>
                    <p>{user?.data.phone === '' ? 'N/A' : user?.data.phone}</p>
                  </span>
                </li>
                <li>
                  <span class='font-bold'>Mission Statement:</span>
                  <span class='text-gray-700'>
                    <p>{user?.data.description === '' ? 'N/A' : user?.data.description}</p>
                  </span>
                </li>
              </ul>
            </div>
            <div class='profile-favs'>
              <div class='container mx-auto mb-4 px-5 py-2 lg:px-32 lg:pt-12 space-y-4'>
                <div class='shelter-pet-list'>
                  <p class='text-xl font-bold center-text mr-4'>Listed Pets</p>
                    <a href='petlistings/create'>
                      <button class='bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded-full'>
                        +
                      </button>
                    </a>
                </div>
                <div className='-m-1 flex flex-wrap md:-m-2'>
                  {shelterPets?.map((pet) => (
                    <div className='flex w-full md:w-1/2 lg:w-1/3 p-1 md:p-2 flex flex-col items-center'>
                      <a href={`/petlistings/${pet.id}/edit`} className='w-full block'>
                        <img
                          alt={pet.name}
                          className='block w-full h-64 rounded-lg object-cover object-center'
                          src={pet.photos[0] ? `${process.env.REACT_APP_API_URL}${pet.photos[0].url}` : '../../../images/logo_ref.png'}
                        />
                      </a>
                      <p className='text-center'>{pet.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div class="container mx-auto mb-4 px-5 py-2 lg:px-32 lg:pt-12 space-y-4">
            <p class="text-xl font-bold center-text mr-4">My Reviews</p>
            {reviews?.map((review) => (
              <div class="review-box mx-auto flex items-center flex-col rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                <div class="flex items-center">
                  {Array.from({ length: review.rating }, (_, index) => (
                    <svg
                      key={index}
                      class="w-4 h-4 text-yellow-300 me-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                    </svg>
                  ))}
                  <p class="ml-2">{review.rating} out of 5</p>
                </div>
                <div class="mt-2">{review.content}</div>
                {review?.reply ? (
                  <p>Your response: {review?.reply.content}</p>
                ) : (
                  <div>
                  <input type="text" class="mt-2 border-2 border-gray-300 rounded-md p-2 w-full" placeholder="Reply to review" />
                  <button class="mt-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded-full"
                    onClick={(e) => handleReply(review.is_author_seeker, review.seeker, review.shelter, e)}
                  >
                    Reply
                  </button>
                </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  return (
    <div class='w-full h-full'>
      {user && renderProfile()}
    </div>


  )
}

export default Profile