import { useAuth } from '../../../context/AuthContext';

import CardWrapper from '../../ui/cards/CardWrapper';
import Card from '../../ui/cards/Card';

import styles from './PetCategories.module.css';

const categories = [
  {
    to: '/petlistings?category=D',
    imgSrc: 'images/dog-profile-2.png',
    text: 'Dog',
  },
  {
    to: '/petlistings?category=C',
    imgSrc: 'images/cat-profile-1.png',
    text: 'Cat',
  },
  {
    to: '/petlistings?category=O',
    imgSrc: 'images/other-profile-1.png',
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
