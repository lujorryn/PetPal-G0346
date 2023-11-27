import styles from './Form.module.css'

function Form({classes, children, onSubmit}) {
  return (
    <form className={`${styles.form} ${classes}`} onSubmit={onSubmit} >{children}</form>
  )
}

export default Form