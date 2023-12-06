import styles from '../../ui/Pagination/Pagination.module.css';
import './pagination.css'

// Modified component for use in the app list view
function AppPagination({next, prev, curr, total_pages, setPage}) {
  const handlePrev = () => prev && setPage(() => curr - 1)
  const handleNext = () => next && setPage(() => curr + 1)

  return (
    <ul className={styles.wrapper}>
      <li onClick={handlePrev} className={`${!prev && styles.disabled} app-pagination-btn`}>Prev</li>
      <li onClick={handleNext} className={`${!next && styles.disabled} app-pagination-btn`}>Next</li>
    </ul>
  )
}

export default AppPagination;