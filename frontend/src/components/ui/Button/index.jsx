import styles from './Button.module.css';

function Button({ variation = 'default', classes, handleClick, children, btnId, disabled = false }) {
  return (
    <button
      id={btnId}
      className={`${styles.btn} ${styles[variation]} ${classes}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
