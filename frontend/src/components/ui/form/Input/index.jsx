import styles from './Input.module.css';

function Input({ type = 'text', label, name, id = '', value, placeholder, required = true, classes, onChange }) {
  if(id === '') id = name
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        id={id}
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
