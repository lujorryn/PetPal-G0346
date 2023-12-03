import styles from './PetlistingsPageWrapper.module.css'

function PetlistingsPageWrapper({children}) {
  return (
    <div className={styles.wrapper}>{children}</div>
  )
}

export default PetlistingsPageWrapper