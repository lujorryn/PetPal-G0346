import styles from './Pagination.module.css';

function Pagination({next, prev, curr, total_pages, setPage}) {
  const handlePrev = () => prev && setPage(() => curr - 1)
  const handleNext = () => next && setPage(() => curr + 1)
  const handlePage = (i) => {
    if(i >= 1 && i <= total_pages) setPage(() => i)
  }

  if (total_pages === 1) return <></>
  return (
    <ul className={styles.wrapper}>
      <li onClick={handlePrev} className={`${!prev && styles.disabled}`}>Prev</li>
      {Array.from({ length: total_pages }, (_, i) => (
        <li
          key={i}
          className={`${styles.index} ${
            curr === i + 1 ? styles.active : ''
          }`}
          onClick={() => handlePage(i + 1)}
        >
          {i + 1}
        </li>
      ))}
      <li onClick={handleNext} className={`${!next && styles.disabled}`}>Next</li>
    </ul>
  )
}

export default Pagination;
