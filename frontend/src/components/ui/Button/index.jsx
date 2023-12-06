import styles from './Button.module.css';

function Button({ variation = 'default', classes, handleClick, children, btnId }) {
  return (
    <button
      id={btnId}
      className={`${styles.btn} ${styles[variation]} ${classes}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default Button;
