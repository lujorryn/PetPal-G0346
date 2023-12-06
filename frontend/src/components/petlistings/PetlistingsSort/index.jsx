import { useState } from 'react';
import styles from './PetlistingsSort.module.css'

function PetlistingsSort({sortOption, setSortOption, sortAsc, setSortAsc}) {
  const [selectedOption, setSelectedOption] = useState(sortOption)
  const [ascending, setAscending] = useState(sortAsc)

  const handleChange = e => {
    const {value} = e.target
    setSelectedOption(value)
    setSortOption(value)
  }
  const handleDirectionChange = e => {
    const {value} = e.target
    setAscending(value)
    setSortAsc(value)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.select}>
        <label htmlFor='sort-by'>Sort By </label>
      </div>
      <div className={styles.select}>
        <select value={selectedOption} onChange={handleChange} id='sort-by'>
          <option value='none'>None</option>
          <option value='name'>Name</option>
          <option value='created_time'>Date Uploaded</option>
          <option value='last_updated'>Date Updated</option>
          <option value='age'>Age</option>
        </select>
      </div>
      <div className={styles.select}>
        <select value={ascending} onChange={handleDirectionChange}>
          <option value={true}>Ascending</option>
          <option value={false}>Descending</option>
        </select>
      </div>
    </div>
  )
}

export default PetlistingsSort