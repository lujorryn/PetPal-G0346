import styles from "./BlogContentForm.module.css"

import Button from "../../ui/Button"

const API_URL = process.env.REACT_APP_API_URL

function BlogContentForm({handleSubmit, setHero, blogPost=null, isCreate=true}){
  return (
    <div className={styles.wrapper}>
      <div className={styles.imgwrapper}>
        <img className={styles.img} src={blogPost && blogPost.image ? `${API_URL}${blogPost.image}` : "/images/gallery-1.png"} alt="blog-hero" />
      </div>
      <input type="file" id="blog-image" name="blog-image" accept="image/*"
        onChange={(e) => setHero(e.target.files[0])}
        className={styles.file}
      />
      <form className={styles.form} id="blog-form" onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>Blog Title</label>
          <input type="text" id="title" name="title" className={styles.input} defaultValue={blogPost? blogPost.title : ''} required={isCreate}/>
        </div>
        <div className={styles.field}>
          <label htmlFor="content" className={styles.label}>Blog Content</label>
          <textarea type="text" id="content" name="content" rows="30"
            className={`${styles.input} ${styles.content}`}
            defaultValue={blogPost? blogPost.content : ''}
            required={isCreate}/>
        </div>
        <Button type="submit" classes={styles.btn}>{isCreate ? 'Create' : 'Save'}</Button>
      </form>
    </div>
  )
}

export default BlogContentForm