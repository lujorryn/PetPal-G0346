import { Link } from 'react-router-dom';

import styles from './SignupSuccess.module.css';


function SignupSuccessMessage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.success}>
        <h4 className='h5'>Thank you for signing up</h4>
        <p className={styles.instr}>
          Checkout our <Link to='' className={styles.link}>home</Link> or{' '}
          <Link to='/login' className={styles.link}>login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupSuccessMessage;
