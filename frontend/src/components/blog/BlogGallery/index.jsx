import styles from "./BlogGallery.module.css"

import { Link } from "react-router-dom";

import CardWrapper from "../../ui/cards/CardWrapper";
import BlogCard from "../BlogCard";

const API_URL = process.env.REACT_APP_API_URL

function BlogGallery({blogPosts, isOwner}) {
  return (
    <div className={styles.wrapper}>
      { blogPosts.length > 0 ? (
        <>
          {isOwner && <Link to={`create`} className={`${styles.btn} ${styles.default}`}>New Blog Post</Link>}
          <CardWrapper>
            { blogPosts.map( blogPost => {
              const defaultImg = '/images/gallery-1.png'
              return <BlogCard
                key={blogPost.id}
                to={`post/${blogPost.id}`} 
                imgSrc={blogPost.image ? `${API_URL}${blogPost.image}` : defaultImg} 
                title={blogPost.title}
                content={blogPost.content}
              />
            })}
          </CardWrapper>
        </>
      ) : (
        <p>This shelter has no blog posts</p>
      )}
    </div>
  )
}

export default BlogGallery