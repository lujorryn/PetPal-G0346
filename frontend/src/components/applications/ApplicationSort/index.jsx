import { useState } from 'react';
import styles from './ApplicationSort.module.css'

function ApplicationSort({sortOption, setSortOption}) {
  const [selectedOption, setSelectedOption] = useState(sortOption)

  const handleChange = e => {
    const {value} = e.target
    setSelectedOption(value)
    setSortOption(value)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.select}>
        <label htmlFor='sort-by'>Sort By </label>
      </div>
      <div className={`${styles.select} ${styles.option}`}>
        <select value={selectedOption} onChange={handleChange} id='sort-by' className={styles.option}>
          <option value='created_time'>Created Time</option>
          <option value='last_updated'>Last Updated</option>
        </select>
      </div>
    </div>
  )
}

export default ApplicationSort