import { useEffect, useState } from 'react';

import Button from '../../ui/Button';
import PetlistingsFilterItem from '../PetlistingsFilterItem';

import styles from './PetlistingsFilter.module.css';

import { availableFilters } from '../../../constants/filter';

function PetlistingsFilter({ setFilters }) {
  const [searchFilters, setSearchFilters] = useState(availableFilters);
  const [resetFilter, setResetFilter] = useState(false)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(window.innerWidth > 832 ? true : false);

  const clearFilter = () => {
    console.log('clear all filters')
    setResetFilter(true)
    setFilters(() => ({}));
  };

  const toggleFilterMenu = () => {
    if(window.innerWidth > 832) {
      setIsFilterMenuOpen(true)
    } else {
      setIsFilterMenuOpen(!isFilterMenuOpen)
    }
  }

  
  useEffect(() => {
    const setFilterMenu = () => {
      if(window.innerWidth > 832) setIsFilterMenuOpen(true)
      else setIsFilterMenuOpen(false)
    }
    window.addEventListener('resize', setFilterMenu);
    return () => window.removeEventListener('resize', setFilterMenu);
  }, []);

  return (
    <div className={styles.wrapper}>
      <h6 className='h6' onClick={toggleFilterMenu}>Filters</h6>
      {isFilterMenuOpen ? (
        <>
          <div>
            {searchFilters.map((filter, i) => (
              <PetlistingsFilterItem
                key={i}
                filter={filter}
                setFilters={setFilters}
                setSearchFilters={setSearchFilters}
                resetFilter={resetFilter}
                setResetFilter={setResetFilter}
              />
            ))}
          </div>
          <Button handleClick={clearFilter} classes={styles.btn}>Clear All</Button>
        </>
      ) : (<></>)}
    </div>
  );
}

export default PetlistingsFilter;
