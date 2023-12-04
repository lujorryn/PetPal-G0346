import styles from "./BlogHero.module.css"

const API_URL = process.env.REACT_APP_API_URL

function BlogHero({imgSrc = null}){
  const defaultImg = '/images/gallery-1.png'
  return (
    <div className={styles.wrapper}>
      <img className={styles.img} src={imgSrc ? `${API_URL}${imgSrc}` : defaultImg} alt={'Blog Hero'} />
    </div>
  )
}

export default BlogHero