import { Link } from 'react-router-dom'
import styles from './BlogCard.module.css'

function BlogCard({to, imgSrc, alt = '', title, content, classes}) {
  return (
    <Link to={to} className={`${styles.card} ${classes}`}>
      <img className={styles.img} src={imgSrc} alt={alt} />
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        <p className={styles.content}>{content}</p>
      </div>
    </Link>
  )
}

export default BlogCard