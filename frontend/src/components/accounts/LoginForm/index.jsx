import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

import Form from '../../ui/form/Form';
import Input from '../../ui/form/Input'
import Button from '../../ui/Button';

import styles from './LoginForm.module.css';

const API_URL = process.env.REACT_APP_API_URL;

function LoginForm() {
  const { login, logout } = useAuth();
  const [hasError, setHasError] = useState(false);

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // log user out if they access this page
  useEffect(() => {
    logout()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) throw new Error(`Error status: ${res.status}`);

      const data = await res.json();
      const { access, refresh } = data;

      login(access, refresh);
    } catch (err) {
      setHasError(true);
      console.log('error ', err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Form classes={styles.form} onSubmit={handleSubmit}>
        <h4>Log In</h4>
        {hasError && (
          <p className={styles.error}>Invalid username or password.</p>
        )}
        <Input
          type='email'
          name='email'
          placeholder='Email'
          value={email}
          classes={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type='password'
          name='password'
          placeholder='Password'
          value={password}
          classes={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <div className={styles.instr}>
          <Button>Log In</Button>
          <p>
            Don't have an account? <Link to='/signup' className={styles.link}>Sign up!</Link>
          </p>
        </div>
      </Form>
      
    </div>
  );
}

export default LoginForm;
