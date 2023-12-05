import styles from './Nav.module.css'
import { formatDistanceToNow } from 'date-fns'

function NotificationNav({onClick, handleClick, notifications, readNotifications, sortDesc, handleSort, handleDelete, currentPage, handlePageChange, toggleRead, handleToggle}) {


  const notificationsPerPage = 2

  const totalPages = Math.ceil((toggleRead ? readNotifications : notifications).length / notificationsPerPage)
  const visibleNotifications = (toggleRead ? readNotifications : notifications).slice(
    (currentPage - 1) * notificationsPerPage,
    currentPage * notificationsPerPage
  )

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
        {visibleNotifications.map((note) => (
          <li key={note.id} className={styles.acctlink} onClick={() => handleClick(note.id, note.application_id)}>
            <div className={styles.nlist}>
              <a href={`/profile/${note.creator_id}`} className="m-2">
                <img
                  className={styles.img}
                  src={note?.creator_avatar ? `${process.env.REACT_APP_API_URL}/${note.creator_avatar}` : "/images/logo_ref.png"}
                  alt=""
                />
              </a>
              <div className='flex-col cursor-pointer' onClick={(e) => { e.stopPropagation(); handleClick(note.id, note.content_type, note.object_id, note.application_id) }}>
                <div>
                  <span className='font-bold'>{note.subject}</span>
                </div>
                <div>
                  <span>
                    {note.body.length > 80 ? `${note.body.substring(0, 80)}...` : note.body}
                  </span>
                </div>
                <div>
                  <span className='text-xs text-gray-500'>{formatDistanceToNow(new Date(note.created_time))} ago</span>
                </div>
              </div>
              <button className="m-2" onClick={(e) => { e.stopPropagation(); handleDelete(note.id) }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap justify-center m-4">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-btn ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} border border-gray-300 px-4 py-2 rounded-md mb-4 mr-4 focus:outline-none focus:ring focus:border-blue-300`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  )
}

export default NotificationNav