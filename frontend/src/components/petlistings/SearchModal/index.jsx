import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

import SearchIcon from '@mui/icons-material/Search';

import Modal from '../../ui/Modal'
import Input from '../../ui/form/Input';
import Button from '../../ui/Button'

import styles from './SearchModal.module.css'

const SearchModal = ({onClick}) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    onClick()
    navigate(`/petlistings?search=${searchTerm}`)
  };

  return (
    <Modal closeModal={onClick}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          name='search__text'
          value={searchTerm}
          placeholder='Search...'
          onChange={(e) => setSearchTerm(e.target.value)}
          required={false}
        />
        <Button variation='transparent' classes={styles.btn}><SearchIcon className={styles.icon} /></Button>
      </form>
    </Modal>
  );
};

export default SearchModal;
