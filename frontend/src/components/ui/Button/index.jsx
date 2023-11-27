import styles from './Button.module.css';

function Button({ variation = 'default', classes, handleClick, children }) {
  return (
    <button
      className={`${styles.btn} ${styles[variation]} ${classes}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default Button;
