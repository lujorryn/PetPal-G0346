import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import styles from "./BlogContent.module.css"
import Button from "../../ui/Button"

const API_URL = process.env.REACT_APP_API_URL

function BlogContent({title, author, created_date, updated_date, content_list, isOwner, handleDelete}){
  return (
    <>
      <div className={styles.wrapper}>
        <h5 className="h5">{title}</h5>
        <p className={styles.info}>Author: {author}</p>
        <p className={styles.info}>Date: {created_date}</p>
        <p className={styles.info}>Last Updated: {updated_date}</p>
        {content_list.map((paragraph, i) => (
          <p key={i} className={styles.paragraph}>{paragraph}</p>
        ))}
      </div>
      {isOwner ? (<div className={styles.btnwrapper}>
          <Link to={`edit`} className={`${styles.btn} ${styles.green}`}>Edit</Link>
          <Button classes={`${styles.btn}`} handleClick={handleDelete}>Delete</Button>
        </div>
        ) : (<></>)}
    </>
  )
}

export default BlogContent