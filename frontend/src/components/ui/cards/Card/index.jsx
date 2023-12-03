import { Link } from 'react-router-dom'
import styles from './Card.module.css'

function Card({to, imgSrc, alt = '', text, classes}) {
  return (
    <Link to={to} className={`${styles.card} ${classes}`}>
      <img className={styles.img} src={imgSrc} alt={alt} />
      <p className={styles.text}>{text}</p>
    </Link>
  )
}

export default Card