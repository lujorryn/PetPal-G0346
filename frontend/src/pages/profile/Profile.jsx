import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Profile.css'
import '../../styles/tailwind.css'

function Profile() {
  const { token, userId, role } = useAuth()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Fetch user data
    if (role === 'seeker') {
      fetch(`${process.env.REACT_APP_API_URL}/api/seekers/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.log(err))
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/api/shelters/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.log(err))
    }
  }, [token, userId, role])

  return (
    <div class="profile-grid">
      <div class="profile-img">
          <div class="profile-container">
            <img class="rounded-full w-full h-full" src={`${process.env.REACT_APP_API_URL}${user?.user_data.avatar}`} alt="profile" />
          </div>
          <a href="profile/edit" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">Edit Profile</a>
      </div>
      <div class="profile-desc">
        <p class="font-semibold text-5xl break-all">Your Profile</p>
        <hr class="line"></hr>
        <ul class="profile-list">
          <li>
            <span class="font-bold">Email:</span>
            <span class="text-gray-700">
              <a href="mailto: {user?.user_data.email}">{user?.user_data.email}</a>
            </span>
          </li>
          <li>
            <span class="font-bold">Adress:</span>
            <span class="text-gray-700">
              <p>{user?.user_data.address === '' ? 'N/A' : user?.user_data.address}</p>
            </span>
          </li>
          <li>
            <span class="font-bold">Postal Code:</span>
            <span class="text-gray-700">
              <p>{user?.user_data.postal_code === '' ? 'N/A' : user?.user_data.postal_code}</p>
            </span>
          </li>
          <li>
            <span class="font-bold">City:</span>
            <span class="text-gray-700">
              <p>{user?.user_data.city === '' ? 'N/A' : user?.user_data.city}</p>
            </span>
          </li>
          <li>
            <span class="font-bold">Province:</span>
            <span class="text-gray-700">
              <p>{user?.user_data.province === '' ? 'N/A' : user?.user_data.province}</p>
            </span>
          </li>
          <li>
            <span class="font-bold">Phone:</span>
            <span class="text-gray-700">
              <p>{user?.user_data.phone === '' ? 'N/A' : user?.user_data.phone}</p>
            </span>
          </li>
          <li>
            <a class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-full" href="applications">My Applications</a>
          </li>
        </ul>
      </div>
      <div class="profile-favs">
        <div class="container mx-auto mb-4 px-5 py-2 lg:px-32 lg:pt-12 space-y-4">
          <p class="text-xl font-bold">Your Favorites</p>
          <div class="-m-1 flex flex-wrap md:-m-2">
            {user?.fav_pets.map((pet) => (
              <div class="flex w-full md:w-1/2 lg:w-1/3 p-1 md:p-2 flex justify-center items-center">
                <a href={`/petlistings/${pet.id}`}>
                  <img
                  alt="gallery"
                  class="block h-64 w-full rounded-lg object-cover object-center"
                  src="TODO: Add image here"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile