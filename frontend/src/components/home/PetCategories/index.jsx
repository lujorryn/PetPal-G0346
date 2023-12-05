import { useAuth } from '../../../context/AuthContext';

import CardWrapper from '../../ui/cards/CardWrapper';
import Card from '../../ui/cards/Card';

import styles from './PetCategories.module.css';

const categories = [
  {
    to: '/petlistings',
    imgSrc: '/images/dog-profile-2.png',
    text: 'Dogs',
  },
  {
    to: '/petlistings',
    imgSrc: '/images/cat-profile-1.png',
    text: 'Cats',
  },
  {
    to: '/petlistings',
    imgSrc: '/images/other-profile-1.png',
    text: 'Other',
  },
];

function PetCategories() {
  const { token } = useAuth()
  return (
    <section className={styles.wrapper}>
      <h5 className='h5'>Available for adoption</h5>

      <CardWrapper>
        {categories.map((cat, i) => (
          <Card key={i} to={!token ? '/login' : cat.to} imgSrc={cat.imgSrc} text={cat.text} />
        ))}
      </CardWrapper>
    </section>
  );
}

export default PetCategories;
