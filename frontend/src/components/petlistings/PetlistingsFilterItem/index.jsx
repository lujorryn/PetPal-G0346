import { useEffect, useState } from 'react';
import Button from '../../ui/Button';

import styles from './PetlistingsFilterItem.module.css';

function SearchFilterItem({ filter, setFilters, resetFilter, setResetFilter }) {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [age, setAge] = useState(filter.value || 0);
  const [selectedOption, setSelectedOption] = useState(filter.value);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSelectedOption(value);
    setFilters((filters) => ({ ...filters, [name]: value }));
    setResetFilter(false)
  };

  const handleAgeInput = (e) => {
    setAge(e.target.value);
    setFilters((filters) => ({ ...filters, age: e.target.value }));
  };

  const reset = (e) => {
    const name = e.target.parentElement.id;

    if (name === 'age') {
      setAge(0);
    } else {
      setSelectedOption(null);
    }

    setFilters((prev) => {
      const updatedFilters = { ...prev };
      delete updatedFilters[name];
      return updatedFilters;
    });
  };

  return (
    <div>
      <div
        className={styles.dropdown}
        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
      >
        <span>{`${filter.name[0].toUpperCase()}${filter.name.slice(1)}`}</span>
        <div
          className={`${styles.caret} ${isFilterMenuOpen ? styles.rotate : ''}`}
        ></div>
      </div>

      {isFilterMenuOpen ? (
        <div id={filter.name}>
          {filter.options ? (
            <div className={styles.options} id={filter.name}>
              {filter.options.map((option, i) => (
                <div key={i} className={styles.option}>
                  <input
                    type='radio'
                    id={option.label}
                    name={filter.name}
                    value={option.value}
                    checked={selectedOption === option.value && !resetFilter}
                    onChange={handleFilterChange}
                  />
                  <label htmlFor={option.label}>{option.label}</label>
                </div>
              ))}
            </div>
          ) : (
            <>
              <input
                type='number'
                name={filter.name}
                value={age}
                onInput={handleAgeInput}
                id={filter.name}
                className={styles.numinput}
              />
            </>
          )}
          <Button classes={styles.btn} handleClick={reset}>
            Reset
          </Button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default SearchFilterItem;
