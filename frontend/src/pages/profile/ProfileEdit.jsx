import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Profile.css'
import '../../styles/tailwind.css'
import { useNavigate } from 'react-router-dom'

function ProfileEdit() {
  const { token, userId, role , logout } = useAuth()
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
    if (role === 'seeker') {
      formData.append('is_notif_petlisting', document.getElementById('petlisting-checkbox').checked)
    }
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

  const handleDelete = () => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");

    if (isConfirmed) {
      fetch(`${process.env.REACT_APP_API_URL}/api/accounts/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => res.json())
        .then(logout())
        .catch(err => console.log(err))
    }
  }

  const renderProfile = () => {
    if (role === 'seeker') {
      return (
        <div className="profile-grid">
          <div className="profile-img">
            <div className="profile-container">
              <img className="rounded-full w-full h-full" src={user?.data.avatar? `${process.env.REACT_APP_API_URL}${user?.data.avatar}` : "../../../images/logo_ref.png"} alt="../../../images/logo_ref.png" />
              </div>
            <input type="file" id="profile-image" name="profile-image" accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </div>
          <div className="profile-desc">
            <p className="font-semibold text-5xl break-all">Your Profile</p>
            <hr className="line"></hr>
            <form className="profile-form" id="profile-form" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="first_name" className="font-bold">First Name:</label>
                <input type="first_name" id="first_name" name="first_name" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.first_name} required/>
              </div>
              <div className="mb-4">
                <label htmlFor="last_name" className="font-bold">Last Name:</label>
                <input type="last_name" id="last_name" name="last_name" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.last_name} required/>
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="font-bold">Email:</label>
                <input type="email" id="email" name="email" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.email} required/>
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="font-bold">Address:</label>
                <input type="text" id="address" name="address" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.address}/>
              </div>
              <div className="mb-4">
                <label htmlFor="postal" className="font-bold">Postal Code:</label>
                <input type="text" id="postal" name="postal" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.postal_code}/>
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="font-bold">City:</label>
                <input type="text" id="city" name="city" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.city}/>
              </div>
              <div className="mb-4">
                <label htmlFor="province" className="font-bold">Province:</label>
                <input type="text" id="province" name="province" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.province}/>
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="font-bold">Phone:</label>
                <input type="tel" id="phone" name="phone" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.phone}/>
              </div>
              <div className="flex items-center mb-4">
                <input id="comment-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  defaultChecked={user?.data.is_notif_comment}
                />
                <label htmlFor="comment-checkbox" className="ms-2 text-sm font-medium">Recieve Notifications for comments</label>
              </div>
              <div className="flex items-center mb-4">
                <input id="status-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  defaultChecked={user?.data.is_notif_status}
                />
                <label htmlFor="status-checkbox" className="ms-2 text-sm font-medium">Recieve Notifications for status change</label>
              </div>
              <div className="flex items-center mb-4">
                <input id="petlisting-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  defaultChecked={user?.data.is_notif_petlisting}
                />
                <label htmlFor="petlisting-checkbox" className="ms-2 text-sm font-medium">Recieve Notifications for petlistings</label>
              </div>
              <div className="mb-4">
                <button type="submit" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-full">Update Profile</button>
              </div>
            </form>
            <div className="mb-4">
                <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-full"
                onClick={handleDelete}
                >Delete Profile</button>
              </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="profile-grid">
          <div className="profile-img">
            <div className="profile-container">
              <img className="rounded-full w-full h-full" src={user?.data.avatar? `${process.env.REACT_APP_API_URL}${user?.data.avatar}` : "../../../images/logo_ref.png"} alt="../../../images/logo_ref.png" />
              </div>
            <input type="file" id="profile-image" name="profile-image" accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </div>
          <div className="profile-desc">
            <p className="font-semibold text-5xl break-all">Your Profile</p>
            <hr className="line"></hr>
            <form className="profile-form" id="profile-form" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="first_name" className="font-bold">Name:</label>
                <input type="first_name" id="first_name" name="first_name" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.first_name} required/>
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="font-bold">Email:</label>
                <input type="email" id="email" name="email" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.email} required/>
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="font-bold">Address:</label>
                <input type="text" id="address" name="address" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.address}/>
              </div>
              <div className="mb-4">
                <label htmlFor="postal" className="font-bold">Postal Code:</label>
                <input type="text" id="postal" name="postal" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.postal_code}/>
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="font-bold">City:</label>
                <input type="text" id="city" name="city" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.city}/>
              </div>
              <div className="mb-4">
                <label htmlFor="province" className="font-bold">Province:</label>
                <input type="text" id="province" name="province" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.province}/>
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="font-bold">Phone:</label>
                <input type="tel" id="phone" name="phone" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.phone}/>
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="font-bold">Mission Statement:</label>
                <input type="tel" id="description" name="description" className="w-full px-3 py-2 border rounded-lg" defaultValue={user?.data.description}/>
              </div>
              <div className="flex items-center mb-4">
                <input id="comment-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  defaultChecked={user?.data.is_notif_comment}
                />
                <label htmlFor="comment-checkbox" className="ms-2 text-sm font-medium">Recieve Notifications for comments</label>
              </div>
              <div className="flex items-center mb-4">
                <input id="status-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  defaultChecked={user?.data.is_notif_status}
                />
                <label htmlFor="status-checkbox" className="ms-2 text-sm font-medium">Recieve Notifications for status change</label>
              </div>
              <div className="mb-4">
                <button type="submit" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-full">Update Profile</button>
              </div>
            </form>
            <div className="mb-4">
                <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-full"
                onClick={handleDelete}
                >Delete Profile</button>
              </div>
          </div>
        </div>
      )
    }
  }


  return (
    <div className="w-full h-full">
      {renderProfile()}
    </div>
  )
}

export default ProfileEdit