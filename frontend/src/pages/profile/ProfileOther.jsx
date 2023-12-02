import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Profile.css'
import '../../styles/tailwind.css'
import { useNavigate } from 'react-router-dom'

function ProfileOther() {
    const { token, userId, role } = useAuth()
    const [seeker, setSeeker] = useState(null)
    const [shelter, setShelter] = useState(null)
    const [shelterPets, setShelterPets] = useState(null)
    const [shelterReviews, setShelterReviews] = useState(null)
    const [rating, setRating] = useState(5)
    const [is_reviewed, setIsReviewed] = useState(false)
    // 1 = seeker->shelter, 2 = shelter->seeker, 3 = shelter->shelter
    const [state, setState] = useState(0)
    const navigate = useNavigate()
    const url = window.location.href
    const urlSplit = url.split('/')
    const otherUserId = urlSplit[urlSplit.length - 1]

    useEffect(() => {
        if (otherUserId === userId) {
            return navigate('/profile')
        }

        try {
            fetch(`${process.env.REACT_APP_API_URL}/api/shelters/${otherUserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (res.status === 403 || res.status === 404) {
                        fetch(`${process.env.REACT_APP_API_URL}/api/seekers/${otherUserId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                            .then((res) => {
                                if (res.status === 403 || res.status === 404) {
                                    navigate('/profile')
                                } else {
                                    return res.json()
                                }
                            })
                            .then((data) => {
                                setSeeker(data)
                                setState(2)
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                        } else {
                            return res.json()
                        }
                    })
                    .then((data) => {
                        setShelter(data)
                        if (role === 'seeker') {
                            setState(1)
                        } else {
                            setState(3)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
        } catch (err) {
            console.log(err)
        }
    }, [token, userId, role, navigate, otherUserId])

    useEffect(() => {
        const getShelterPets = async () => {
            var nextPage = `${process.env.REACT_APP_API_URL}/api/petlistings/shelter/${shelter?.data.email}`
            const allResults = []
            try {
                while (nextPage) {
                    const res = await fetch(nextPage, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    const data = await res.json()
                    allResults.push(...data.results.data)
                    nextPage = data.next
                }
                setShelterPets(allResults)
            } catch (err) {
                console.log(err)
            }
        }

        const getShelterReviews = async () => {
            var nextPage = `${process.env.REACT_APP_API_URL}/api/comments/shelter/${otherUserId}`
            const allResults = []
            var pageNum = 1
            try {
                while (nextPage) {
                    const res = await fetch(nextPage, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    const data = await res.json()
                    allResults.push(...data.data)
                    if (data.page.has_next) {
                        nextPage = `${process.env.REACT_APP_API_URL}/api/comments/shelter/${otherUserId}?page=${pageNum + 1}`
                        pageNum += 1
                    } else {
                        break
                    }
                }
                setShelterReviews(allResults)
            } catch (err) {
                console.log(err)
            }
        }

        if (shelter?.data.email) {
            getShelterPets()
            getShelterReviews()
        }
    }, [shelter?.data.email, token, otherUserId, shelter?.data])

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        try {
            fetch(`${process.env.REACT_APP_API_URL}/api/comments`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    is_review: true,
                    content: e.target.review.value,
                    recipient_email: shelter?.data.email,
                    rating: rating,
                    application_id: null,
                }),
            }).then((res) => {
                if (res.status === 403 || res.status === 404 || res.status === 400) {
                    setIsReviewed(true)
                } else {
                    window.location.reload()
                }
            }).catch((err) => {
                console.log(err)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const renderProfile = () => {
        // 3 cases: seeker->shelter, shelter->seeker, shelter->shelter
        switch (state) {
            case 1:
                return renderSeekerShelter()
            case 2:
                return renderShelterSeeker()
            case 3:
                return renderShelterShelter()
            default:
                navigate('/profile')
        }
    }

    const renderSeekerShelter = () => {
        return (
        <div>
            <div class='profile-grid'>
            <div class='profile-img'>
                <div class='profile-container'>
                  <img class='rounded-full w-full h-full' src={shelter?.data.avatar? `${process.env.REACT_APP_API_URL}${shelter?.data.avatar}` : '../../../images/logo_ref.png'} alt='../../../images/logo_ref.png' />
                </div>
            </div>
            <div class='profile-desc'>
              <p class='font-semibold text-5xl break-all'>Shelter Profile</p>
              <div class="flex items-center">
                {shelter?.data.avg_rating === 0 ? (
                    <span>No Rating</span>
                ) : (
                    <div class="flex items-center">
                    {Array.from({ length: shelter?.data.avg_rating }, (_, index) => (
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
                    {shelter?.data.avg_rating.toFixed(2)} out of 5
                    </div>
                )}
                </div>
              <hr class='line'></hr>
              <ul class='profile-list'>
                <li>
                  <span class='font-bold'>Email:</span>
                  <span class='text-gray-700'>
                    <a href={`mailto:${shelter?.data.email}`}>{shelter?.data.email}</a>
                  </span>
                </li>
                <li>
                  <span class='font-bold'>Adress:</span>
                  <span class='text-gray-700'>
                    <p>{shelter?.data.address === '' ? 'N/A' : shelter?.data.address}</p>
                  </span>
                </li>
                <li>
                  <span class='font-bold'>Postal Code:</span>
                  <span class='text-gray-700'>
                    <p>{shelter?.data.postal_code === '' ? 'N/A' : shelter?.data.postal_code}</p>
                  </span>
                </li>
                <li>
                  <span class='font-bold'>City:</span>
                  <span class='text-gray-700'>
                    <p>{shelter?.data.city === '' ? 'N/A' : shelter?.data.city}</p>
                  </span>
                </li>
                <li>
                  <span class='font-bold'>Province:</span>
                  <span class='text-gray-700'>
                    <p>{shelter?.data.province === '' ? 'N/A' : shelter?.data.province}</p>
                  </span>
                </li>
                <li>
                  <span class='font-bold'>Phone:</span>
                  <span class='text-gray-700'>
                    <p>{shelter?.data.phone === '' ? 'N/A' : shelter?.data.phone}</p>
                  </span>
                </li>
                <li>
                  <span class='font-bold'>Mission Statement:</span>
                  <span class='text-gray-700'>
                    <p>{shelter?.data.description === '' ? 'N/A' : shelter?.data.description}</p>
                  </span>
                </li>
              </ul>
            </div>
            <div class='profile-favs'>
              <div class='container mx-auto mb-4 px-5 py-2 lg:px-32 lg:pt-12 space-y-4'>
                <div class='shelter-pet-list'>
                  <p class='text-xl font-bold center-text mr-4'>Listed Pets</p>
                </div>
                <div className='-m-1 flex flex-wrap md:-m-2'>
                  {shelterPets?.map((pet) => (
                    <div className='flex w-full md:w-1/2 lg:w-1/3 p-1 md:p-2 flex flex-col items-center'>
                      <a href={`/petlistings/${pet.id}`} className='w-full block'>
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
                <p class="text-xl font-bold center-text mr-4">Shelter Reviews</p>
                {shelterReviews?.map((review) => (
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
                    <p class="mt-2 text-white">{review.rating.toFixed(2)} out of 5</p>
                    </div>
                    <div class="mt-2 text-white">{review.seeker}: {review.content}</div>
                    {review?.reply ? (
                    <p class="mt-2 text-white">Shelter's response: {review?.reply.content}</p>
                    ) : (
                    <div>
                    </div>
                    )}
                </div>
                ))}
          </div>
          <div class="container mx-auto mb-4 px-5 py-2 lg:px-32 lg:pt-12 space-y-4">
            <form class="review-box mx-auto block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700" onSubmit={handleSubmitReview}>
                <label for="review" class="text-base text-neutral-600 dark:text-neutral-200 mb-2">
                    Leave a review:
                </label>
                <textarea id="review" name="review" class="w-full px-3 py-4 border rounded-lg mb-4" placeholder="Leave your review here" required></textarea>
                <label for="rating" class="text-base text-neutral-600 dark:text-neutral-200 mb-2">
                    Rating:
                </label>
                <p class="text-base text-neutral-600 dark:text-neutral-200" id="rating-display">{Array.from({ length: rating }, (_, index) => (
                    <span class="text-yellow-300" key={index}>⭐</span>
                ))}</p>
                <input type="range" id="rating" name="rating" min="1" max="5" step="1" value={rating} class="w-full mb-4" onChange={(e) => setRating(e.target.value)}></input>
                {is_reviewed ? (
                    <p class="text-base text-neutral-600 dark:text-neutral-200 mb-2">You have already reviewed this shelter.</p>
                ) : (
                    <div></div>
                )}
                <button type="submit" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">Leave a review</button>
            </form>
            </div>
        </div>
        )
    }

    const renderShelterSeeker = () => {
        return (
            <div class='profile-grid'>
            <div class='profile-img'>
                <div class='profile-container'>
                    <img class='rounded-full w-full h-full' src={seeker?.data.avatar? `${process.env.REACT_APP_API_URL}${seeker?.data.avatar}` : '../../../images/logo_ref.png'} alt='../../../images/logo_ref.png' />
                </div>
            </div>
            <div class='profile-desc'>
                <p class='font-semibold text-5xl break-all'>Seeker Profile</p>
                <hr class='line'></hr>
                <ul class='profile-list'>
                <li>
                    <span class='font-bold'>Email:</span>
                    <span class='text-gray-700'>
                    <a href={`mailto:${seeker?.data.email}`}>{seeker?.data.email}</a>
                    </span>
                </li>
                <li>
                    <span class='font-bold'>Adress:</span>
                    <span class='text-gray-700'>
                    <p>{seeker?.data.address === '' ? 'N/A' : seeker?.data.address}</p>
                    </span>
                </li>
                <li>
                    <span class='font-bold'>Postal Code:</span>
                    <span class='text-gray-700'>
                    <p>{seeker?.data.postal_code === '' ? 'N/A' : seeker?.data.postal_code}</p>
                    </span>
                </li>
                <li>
                    <span class='font-bold'>City:</span>
                    <span class='text-gray-700'>
                    <p>{seeker?.data.city === '' ? 'N/A' : seeker?.data.city}</p>
                    </span>
                </li>
                <li>
                    <span class='font-bold'>Province:</span>
                    <span class='text-gray-700'>
                    <p>{seeker?.data.province === '' ? 'N/A' : seeker?.data.province}</p>
                    </span>
                </li>
                <li>
                    <span class='font-bold'>Phone:</span>
                    <span class='text-gray-700'>
                    <p>{seeker?.data.phone === '' ? 'N/A' : seeker?.data.phone}</p>
                    </span>
                </li>
                <li>
                    <a class='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-full' href='applications'>Seeker Applications</a>
                </li>
                </ul>
            </div>
        </div>
        )
    }

    const renderShelterShelter = () => {
        return (
            <div>
                <div class='profile-grid'>
                <div class='profile-img'>
                    <div class='profile-container'>
                    <img class='rounded-full w-full h-full' src={shelter?.data.avatar? `${process.env.REACT_APP_API_URL}${shelter?.data.avatar}` : '../../../images/logo_ref.png'} alt='../../../images/logo_ref.png' />
                    </div>
                </div>
                <div class='profile-desc'>
                <p class='font-semibold text-5xl break-all'>Shelter Profile</p>
                <div class="flex items-center">
                    {shelter?.data.avg_rating === 0 ? (
                        <span>No Rating</span>
                    ) : (
                        <div class="flex items-center">
                        {Array.from({ length: shelter?.data.avg_rating }, (_, index) => (
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
                        {shelter?.data.avg_rating.toFixed(2)} out of 5
                        </div>
                    )}
                    </div>
                <hr class='line'></hr>
                <ul class='profile-list'>
                    <li>
                    <span class='font-bold'>Email:</span>
                    <span class='text-gray-700'>
                        <a href={`mailto:${shelter?.data.email}`}>{shelter?.data.email}</a>
                    </span>
                    </li>
                    <li>
                    <span class='font-bold'>Adress:</span>
                    <span class='text-gray-700'>
                        <p>{shelter?.data.address === '' ? 'N/A' : shelter?.data.address}</p>
                    </span>
                    </li>
                    <li>
                    <span class='font-bold'>Postal Code:</span>
                    <span class='text-gray-700'>
                        <p>{shelter?.data.postal_code === '' ? 'N/A' : shelter?.data.postal_code}</p>
                    </span>
                    </li>
                    <li>
                    <span class='font-bold'>City:</span>
                    <span class='text-gray-700'>
                        <p>{shelter?.data.city === '' ? 'N/A' : shelter?.data.city}</p>
                    </span>
                    </li>
                    <li>
                    <span class='font-bold'>Province:</span>
                    <span class='text-gray-700'>
                        <p>{shelter?.data.province === '' ? 'N/A' : shelter?.data.province}</p>
                    </span>
                    </li>
                    <li>
                    <span class='font-bold'>Phone:</span>
                    <span class='text-gray-700'>
                        <p>{shelter?.data.phone === '' ? 'N/A' : shelter?.data.phone}</p>
                    </span>
                    </li>
                    <li>
                    <span class='font-bold'>Mission Statement:</span>
                    <span class='text-gray-700'>
                        <p>{shelter?.data.description === '' ? 'N/A' : shelter?.data.description}</p>
                    </span>
                    </li>
                </ul>
                </div>
                <div class='profile-favs'>
                <div class='container mx-auto mb-4 px-5 py-2 lg:px-32 lg:pt-12 space-y-4'>
                    <div class='shelter-pet-list'>
                    <p class='text-xl font-bold center-text mr-4'>Listed Pets</p>
                    </div>
                    <div className='-m-1 flex flex-wrap md:-m-2'>
                    {shelterPets?.map((pet) => (
                        <div className='flex w-full md:w-1/2 lg:w-1/3 p-1 md:p-2 flex flex-col items-center'>
                        <a href={`/petlistings/${pet.id}`} className='w-full block'>
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
                <p class="text-xl font-bold center-text mr-4">Shelter Reviews</p>
                {shelterReviews?.map((review) => (
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
                    <p class="mt-2 text-white">{review.rating.toFixed(2)} out of 5</p>
                    </div>
                    <div class="mt-2 text-white">{review.seeker}: {review.content}</div>
                    {review?.reply ? (
                    <p class="mt-2 text-white">Shelter's response: {review?.reply.content}</p>
                    ) : (
                    <div>
                    </div>
                    )}
                </div>
                ))}
          </div>
        </div>
        )
    }

    return (
        <div class='w-full h-full'>
            {renderProfile()}
        </div>
    )
}

export default ProfileOther