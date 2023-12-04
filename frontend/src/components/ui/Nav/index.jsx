import { useEffect, useState } from 'react'

import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useAuth } from '../../../context/AuthContext';

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
);

function Nav() {
  const { userId, role } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen)
    setIsNotificationOpen(false)
    setIsAccountOpen(false)
  }
  const handleNotificationClick = () => {
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
              <NotificationsIcon className={styles.icon} onClick={handleNotificationClick}/>
              { isNotificationOpen && <NotificationNav onClick={handleNotificationClick} /> }
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
  );
}

export default Nav;
