import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'

import Input from '../../ui/form/Input'
import Button from '../../ui/Button'
import styles from '../../petlistings/SearchBar/SearchBar.module.css'

// Modified petlisting searchbar for applications
function AppsSearchBar({searchTerm}) {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const [newSearch, setNewSearch] = useState(searchParams.get('search') || '');

  const handleChange = e => setNewSearch(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault()
    setNewSearch('');
    if(newSearch === '') navigate(`/applications`);
    else navigate(`/applications?search=${newSearch}`);
  };

  return (
    <div className={styles.wrapper}> 
      {searchParams.get('search') && <h6 className="h6">Application results for "{searchTerm}" </h6>}
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

export default AppsSearchBar