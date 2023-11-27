import { Link } from 'react-router-dom'
import styles from './Nav.module.css'

const notifications = [
  {
    msg: 'New listing in [insert location here].'
  },
  {
    msg: 'You have a new message from Shelter1.'
  },
  {
    msg: 'Welcome to PetPal!'
  },
]

function NotificationNav({onClick}) {
  return (
    <div className={styles.notification}>
      <h4 className={`${styles.acctlink} h5`}>Notifications</h4>
          <ul>
            { notifications.map( (note,i) => (
              <li key={i}  className={styles.acctlink}>
                <Link to="/messages" className={styles.nlist} onClick={onClick}>
                    <img className={styles.img} src="/images/logo_ref.png" alt="" />
                  <span>{note.msg}</span>
                </Link>
              </li>
            ))}
          </ul>
      </div>
  )
}

export default NotificationNav