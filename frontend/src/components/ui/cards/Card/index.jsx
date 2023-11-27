import { Link } from 'react-router-dom'
import styles from './Card.module.css'

function Card({to, imgSrc, alt = '', text, classes}) {
  return (
    <Link to={to} className={`${styles.card} ${classes}`}>
      <img class={styles.img} src={imgSrc} alt={alt} />
      <p class={styles.text}>{text}</p>
    </Link>
  )
}

export default Card