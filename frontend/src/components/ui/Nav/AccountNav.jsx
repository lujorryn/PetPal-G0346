import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

import styles from './Nav.module.css'

function AccountNav({onClick}) {
  const { logout } = useAuth()

  return (
    <div className={styles.account}>
      <Link
        to='/profile'
        className={styles.acctlink}
        tabIndex='-1'
        onClick={onClick}
        >
        My Profile
      </Link>
      <Link
        to='/messages'
        className={styles.acctlink}
        tabIndex='-1'
        onClick={onClick}
        >
        Messages
      </Link>
      <Link
        to='/login'
        className={styles.acctlink}
        tabIndex='-1'
        onClick={() => {
          onClick()
          logout() 
        }}
      >
        Log Out
      </Link>
    </div>
  );
}

export default AccountNav;
