import styles from './FormField.module.css'

function FormField({classes, children}) {
  return (
    <div className={`${styles.field} ${classes}`}>{children}</div>
  )
}

export default FormField