import { useState } from 'react';

import Input from '../../ui/form/Input'
import Button from '../../ui/Button'
import styles from './SearchBar.module.css'


function SearchBar({searchTerm, setSearchTerm}) {
  const [newSearch, setNewSearch] = useState('')

  const handleChange = e => setNewSearch(e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault()
    setNewSearch('')
    if(newSearch !== '') {
      setSearchTerm(newSearch)
      setNewSearch('')
    } else {
      setSearchTerm('')
      setNewSearch('')
    }
  };

  return (
    <div className={styles.wrapper}>
      {newSearch === '' && <h6 className="h6">Search results for "{searchTerm}" </h6>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input 
          name="search__text"
          placeholder="Search..."
          classes={styles.input}
          value={newSearch}
          onChange={handleChange}
          required={false}
        />
        <Button classes={styles.btn}>Search</Button> 
      </form>
    </div>
  )
}

export default SearchBar