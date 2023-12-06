import { useState } from 'react';
import { useSearchParams } from 'react-router-dom'

import Input from '../../ui/form/Input'
import Button from '../../ui/Button'
import styles from './SearchBar.module.css'


function SearchBar({setSearchTerm}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [newSearch, setNewSearch] = useState(searchParams.get('search') || '')

  const handleChange = e => setNewSearch(e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault()
    setNewSearch('')
    if(newSearch !== '') {
      searchParams.set('search', newSearch)
      setSearchParams(searchParams)
      setSearchTerm(searchParams.get('search'))
      setNewSearch('')
    } else {
      searchParams.delete('search')
      setSearchParams(searchParams)
      setSearchTerm('')
      setNewSearch('')
    }
  };

  return (
    <div className={styles.wrapper}>
      {newSearch === '' && <h6 className="h6">Search results for "{searchParams.get('search')}" </h6>}
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