import styles from './Input.module.css';

function Input({ type = 'text', label, name, value, placeholder, required = true, classes, onChange }) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        className={`${styles.input} ${classes}`}
      ></input>
    </>
  );
}

export default Input;
