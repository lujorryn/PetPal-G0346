import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Profile.css'
import '../../styles/tailwind.css'
import { useNavigate } from 'react-router-dom'

function ProfileEdit() {
  const { token, userId, role } = useAuth()
  const [user, setUser] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch user data
    fetch(`${process.env.REACT_APP_API_URL}/api/${role}s/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json())
      .then(data => {
        setUser(data)
      })
      .catch(err => console.log(err))
  }, [token, userId, role])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    if (avatar) {
      formData.append('avatar', avatar)
    }
    formData.append('is_notif_comment', document.getElementById('comment-checkbox').checked)
    formData.append('is_notif_status', document.getElementById('status-checkbox').checked)
    formData.append('is_notif_petlisting', document.getElementById('petlisting-checkbox').checked)
    fetch(`${process.env.REACT_APP_API_URL}/api/${role}s/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    }).then(res => res.json())
      .then(navigate('/profile'))
      .catch(err => console.log(err))
  }

  return (
    <div class="profile-grid">
      <div class="profile-img">
          <div class="profile-container">
            <img class="rounded-full w-full h-full" src={`${process.env.REACT_APP_API_URL}${user?.user_data.avatar }`} alt="profile" />
          </div>
          <input type="file" id="profile-image" name="profile-image" accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
      </div>
      <div class="profile-desc">
        <p class="font-semibold text-5xl break-all">Your Profile</p>
        <hr class="line"></hr>
        <form class="profile-form" id="profile-form" onSubmit={handleSubmit}>
          <div class="mb-4">
            <label for="email" class="font-bold">Email:</label>
            <input type="email" id="email" name="email" class="w-full px-3 py-2 border rounded-lg" defaultValue={user?.user_data.email} required/>
          </div>
          <div class="mb-4">
            <label for="address" class="font-bold">Address:</label>
            <input type="text" id="address" name="address" class="w-full px-3 py-2 border rounded-lg" defaultValue={user?.user_data.address}/>
          </div>
          <div class="mb-4">
            <label for="postal" class="font-bold">Postal Code:</label>
            <input type="text" id="postal" name="postal" class="w-full px-3 py-2 border rounded-lg" defaultValue={user?.user_data.postal_code}/>
          </div>
          <div class="mb-4">
            <label for="city" class="font-bold">City:</label>
            <input type="text" id="city" name="city" class="w-full px-3 py-2 border rounded-lg" defaultValue={user?.user_data.city}/>
          </div>
          <div class="mb-4">
            <label for="province" class="font-bold">Province:</label>
            <input type="text" id="province" name="province" class="w-full px-3 py-2 border rounded-lg" defaultValue={user?.user_data.province}/>
          </div>
          <div class="mb-4">
            <label for="phone" class="font-bold">Phone:</label>
            <input type="tel" id="phone" name="phone" class="w-full px-3 py-2 border rounded-lg" defaultValue="123-456-7890"/>
          </div>
          <div class="flex items-center mb-4">
            <input id="comment-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              defaultChecked={user?.user_data.is_notif_comment}
            />
            <label for="comment-checkbox" class="ms-2 text-sm font-medium">Recieve Notifications for comments</label>
          </div>
          <div class="flex items-center mb-4">
            <input id="status-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              defaultChecked={user?.user_data.is_notif_status}
            />
            <label for="status-checkbox" class="ms-2 text-sm font-medium">Recieve Notifications for status change</label>
          </div>
          <div class="flex items-center mb-4">
            <input id="petlisting-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              defaultChecked={user?.user_data.is_notif_petlisting}
            />
            <label for="petlisting-checkbox" class="ms-2 text-sm font-medium">Recieve Notifications for petlistings</label>
          </div>
          <div class="mb-4">
          <button type="submit" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-full">Update Profile</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileEdit