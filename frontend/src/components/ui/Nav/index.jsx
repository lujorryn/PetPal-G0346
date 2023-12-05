import { useCallback, useEffect, useState } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'

import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

import LinkItem from './LinkItem';
import SearchModal from '../../petlistings/SearchModal'
import NotificationNav from './NotificationNav';
import AccountNav from './AccountNav';
import styles from './Nav.module.css';


const DefaultNavMenu = (
  <>
    <li>
      <LinkItem to='petlistings'>Adopt</LinkItem>
    </li>
    <li>
      <LinkItem to='shelters'>Shelters</LinkItem>
    </li>
    <li>
      <LinkItem to='login'>Login/Signup</LinkItem>
    </li>
  </>
)

function Nav() {
  const { userId, token,  role } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [readNotifications, setReadNotifications] = useState([])
  const [sortDesc, setSortDesc] = useState(true)
  const navigate = useNavigate()

  const handleSort = () => {
    setSortDesc(!sortDesc)
    notifications.sort((a, b) => {
      if (sortDesc) {
        return new Date(a.created_time) - new Date(b.created_time)
      }
      return new Date(b.created_time) - new Date(a.created_time)
    })
    readNotifications.sort((a, b) => {
      if (sortDesc) {
        return new Date(a.created_time) - new Date(b.created_time)
      }
      return new Date(b.created_time) - new Date(a.created_time)
    })
  }
  
  const handleClick = (id, type, objectId, applicaitonId) => {
    try {
      fetch(`${process.env.REACT_APP_API_URL}/api/notifications/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(() => {
        getNotifications()
        if (type === 'applications') {
          navigate('/applications/' + objectId)
        } else if (type === 'comment' && applicaitonId) {
          navigate('/messages/' + applicaitonId)
        } else if (type === 'comment' && !applicaitonId) {
          navigate('/profile')
        } else {
          navigate('/petlistings/' + objectId)
        }
        getReadNotifications()
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = (id) => {
    try {
      fetch(`${process.env.REACT_APP_API_URL}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(() => {
        getNotifications()
        getReadNotifications()
      })
    } catch (err) {
      console.log(err)
    }
  }

  const getNotifications = useCallback(async () => {
    var nextPage = `${process.env.REACT_APP_API_URL}/api/notifications`
    var notifications = []
    var empty = true
    try {
      while (nextPage) {
        const response = await fetch(nextPage, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (data.results.data.length === 0 && empty) {
          setHasUnreadNotifications(false)
        } else {
          setHasUnreadNotifications(true)
        }
        empty = false
        notifications.push(...data.results.data)
        nextPage = data.next
      }
      setNotifications(notifications)
    } catch (err) {
      console.log(err)
    }
  }, [token])

  const getReadNotifications = useCallback(async () => {
    var nextPage = `${process.env.REACT_APP_API_URL}/api/notifications?is_read=true`
    var notifications = []
    try {
      while (nextPage) {
        const response = await fetch(nextPage, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        notifications.push(...data.results.data)
        nextPage = data.next
      }
      setReadNotifications(notifications)
    } catch (err) {
      console.log(err)
    }
  }, [token])

  useEffect(() => {
    getNotifications()
    getReadNotifications()
  }, [token, getNotifications, getReadNotifications])

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen)
    setIsNotificationOpen(false)
    setIsAccountOpen(false)
  }
  const handleNotificationClick = () => {
    getNotifications()
    setIsSearchOpen(false)
    setIsNotificationOpen(!isNotificationOpen) 
    setIsAccountOpen(false)
  }
  const handleAccountClick = () => {
    setIsSearchOpen(false)
    setIsNotificationOpen(false)
    setIsAccountOpen(!isAccountOpen) 
  }

  return (
    <nav className={styles.nav}>
      <label htmlFor='nav__menu-toggle'>
        <div className={styles.hamburger}></div>
      </label>
      <input
        type='checkbox'
        name='nav__menu-toggle'
        id='nav__menu-toggle'
        className={styles.toggle}
      />

      <ul className={styles.menu}>
        {role ? (
          <>
            {role === 'seeker' ? (
              <li>
                <LinkItem to='applications'>My Applications</LinkItem>
              </li>
            ) : (
              <>
              <li>
                <LinkItem to='applications'>Applications</LinkItem>
              </li>
              <li>
                <LinkItem to={`blog/${userId}`}>My Blog</LinkItem>
              </li>
              </>
            )}
            <li>
              <LinkItem to='petlistings'>Adopt</LinkItem>
            </li>
            <li>
              <LinkItem to='shelters'>Shelters</LinkItem>
            </li>
          </>
        ) : (
          DefaultNavMenu
        )}
      </ul>
      <ul className={styles.icons}>
        {role ? (
          <>
            <li>
              <SearchIcon className={styles.icon} onClick={handleSearchClick} />
              { isSearchOpen && <SearchModal onClick={handleSearchClick} /> }
            </li>
            <li>
              {hasUnreadNotifications ? (
                <NotificationsActiveIcon className={styles.icon} onClick={handleNotificationClick} />
              ) : (
                <NotificationsIcon className={styles.icon} onClick={handleNotificationClick} />
              )}
              { isNotificationOpen && <NotificationNav onClick={handleNotificationClick} handleClick={handleClick} notifications={notifications} readNotifications={readNotifications} sortDesc={sortDesc} handleSort={handleSort} handleDelete={handleDelete} /> }
            </li>
            <li>
              <AccountCircleIcon className={styles.icon} onClick={handleAccountClick} />
              { isAccountOpen && <AccountNav onClick={handleAccountClick} />}
            </li>
          </>
        ) : (
          <></>
        )}
      </ul>
    </nav>
  )
}

export default Nav
