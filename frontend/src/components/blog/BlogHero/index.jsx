import styles from "./BlogHero.module.css"
import { Link } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_URL = process.env.REACT_APP_API_URL

function BlogHero({imgSrc = null, userId}){
  const defaultImg = '/images/gallery-1.png'
  return (
    <>
      <div className={styles.linkwrapper}>
        <Link to={`/blog/${userId}`} className={styles.link}>
          <ArrowBackIcon/>
          <p className={styles.span}>Back to blog</p>
        </Link>
      </div>
      <div className={styles.wrapper}>
        <img className={styles.img} src={imgSrc ? `${API_URL}${imgSrc}` : defaultImg} alt={'Blog Hero'} />
      </div>
    </>
  )
}

export default BlogHero