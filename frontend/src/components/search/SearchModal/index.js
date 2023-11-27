import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

import SearchIcon from '@mui/icons-material/Search';

import Input from '../../ui/form/Input';
import Button from '../../ui/Button'

import styles from './SearchModal.module.css'

const SearchModal = ({onClick}) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    console.log('Search Submit')
    e.preventDefault()
    onClick()
    navigate(`/search?searchTerm=${searchTerm}`)
  };

  return (
    <div className={styles.modal} onClick={(e) => {
        if(e.target.className === `${styles.modal}`) onClick()
      }}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          name='search__text'
          value={searchTerm}
          placeholder='Search...'
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variation='transparent' classes={styles.btn}><SearchIcon className={styles.icon} /></Button>
      </form>
    </div>
  );
};

export default SearchModal;
