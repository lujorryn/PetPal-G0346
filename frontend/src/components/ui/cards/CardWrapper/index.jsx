import styles from './CardWrapper.module.css';

function CardWrapper({ classes, children }) {
  return (
    <div className={`${styles.wrapper} ${classes}`}>{children}</div>
  );
}

export default CardWrapper;
