import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

import CardWrapper from '../../ui/cards/CardWrapper';
import styles from './SheltersList.module.css';

const API_URL = process.env.REACT_APP_API_URL

function SheltersList() {
  const { token } = useAuth()
  const defaultImageSrc = 'images/pet-shelter.png'
  const [shelters, setShelters] = useState([])

  useEffect(() => {
    const fetchThreeShelters = async () => {
      try {
        const res = await fetch(`${API_URL}/api/shelters`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (!res.ok) throw new Error(`Error: ${res.status}`)
        const data = await res.json()
      setShelters(data.data.slice(0, 3))
    } catch (error) {
      console.log('Error', error)
      setShelters([])
    }
  }
  fetchThreeShelters()
  }, [])

  return (
    <section className={styles.wrapper}>
      <h5 className='h5'>Shelters</h5>
      <CardWrapper>
        {shelters.map((shelter, i) => (
          <div key={i} className={styles.container}>
            <img src={shelter.avatar? shelter.avatar : defaultImageSrc} alt={shelter.name} />
            <Link to={`shelters/${shelter.id}`} className={styles.overlay}>
              <p className={styles.text}>{shelter.name}</p>
            </Link>
          </div>
        ))}
      </CardWrapper>
    </section>
  );
}

export default SheltersList;
