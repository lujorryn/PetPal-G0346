import styles from './Nav.module.css'
import { useState } from 'react'

function NotificationNav({onClick, handleClick, notifications, readNotifications, sortDesc, handleSort}) {
  const [toggleRead, setToggleRead] = useState(false)
  console.log('readNotifications', readNotifications)
  console.log('notifications', notifications)
  const handleToggle = () => {
    setToggleRead(!toggleRead)
  }

  return (
    <div className={styles.notification}>
      <h4 className={`${styles.acctlink} h5`}>Notifications</h4>
      <div className="flex items-center space-x-2 m-2">
        <label className="cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={toggleRead}
            onChange={handleToggle}
          />
          <div className={`w-12 h-7 rounded-full p-1 ${toggleRead ? 'bg-gray-500' : 'bg-blue-500'}`}>
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform ${toggleRead ? 'translate-x-full' : 'translate-x-0'}`}></div>
          </div>
        </label>
        <span>{toggleRead ? 'Read' : 'Unread'}</span>
        <label className="cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={sortDesc}
            onChange={handleSort}
          />
          <div className={`w-12 h-7 rounded-full p-1 ${sortDesc ? 'bg-gray-500' : 'bg-blue-500'}`}>
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform ${sortDesc ? 'translate-x-full' : 'translate-x-0'}`}></div>
          </div>
        </label>
        <span>{sortDesc ? 'Descending' : 'Ascending'}</span>
      </div>
          <ul>
            { toggleRead ? (
              readNotifications.map( (note) => (
                <li key={note.id}  className={styles.acctlink} onClick={() => handleClick(note.id)}>
                  <div className={styles.nlist}>
                    <a href={`/profile/${note.creator_id}`}>
                      <img className={styles.img} src={note?.creator_avatar ? `${process.env.REACT_APP_API_URL}/${note.creator_avatar}` : "/images/logo_ref.png"} alt="" />
                    </a>
                      <div className='flex-col cursor-pointer' onClick={(e) => {e.stopPropagation(); handleClick(note.id, note.content_type, note.object_id)}}>
                        <div>
                          <span className='font-bold'>{note.subject}</span>
                        </div>
                        <div>
                          <span>
                          {note.body.length > 80 ? `${note.body.substring(0, 80)}...` : note.body}
                          </span>
                        </div>
                      </div>
                  </div>
                </li>
              ))
            ) : (
              notifications.map( (note) => (
                <li key={note.id}  className={styles.acctlink} onClick={() => handleClick(note.id)}>
                  <div className={styles.nlist}>
                    <a href={`/profile/${note.creator_id}`} className='m-2'>
                      <img className={styles.img} src={note?.creator_avatar ? `${process.env.REACT_APP_API_URL}/${note.creator_avatar}` : "/images/logo_ref.png"} alt="" />
                    </a>
                      <div className='flex-col cursor-pointer' onClick={(e) => {e.stopPropagation(); handleClick(note.id, note.content_type, note.object_id)}}>
                        <div>
                          <span className='font-bold'>{note.subject}</span>
                        </div>
                        <div>
                          <span>
                          {note.body.length > 80 ? `${note.body.substring(0, 80)}...` : note.body}
                          </span>
                        </div>
                      </div>
                  </div>
                </li>
              ))
            )}
          </ul>
    </div>
  )
}

export default NotificationNav