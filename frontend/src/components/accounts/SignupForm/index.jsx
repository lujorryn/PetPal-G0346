import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

import Form from '../../ui/form/Form';
import Input from '../../ui/form/Input';
import FormField from '../../ui/form/FormField';
import Button from '../../ui/Button';

import styles from './SignupForm.module.css';
const API_URL = process.env.REACT_APP_API_URL;

function SignupForm() {
  const navigate = useNavigate()
  const { logout } = useAuth();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [passwordMismatch, setPasswordMismatch] = useState(false)

  const [hasError, setHasError] = useState(false);
  const [hasMissingField, setHasMissingField] = useState(false);
  const [role, setRole] = useState('seeker');

  const handlePassword = e => {
    if (password2 !== password) setPasswordMismatch(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password2 !== password) {
      setPasswordMismatch(true)
      return
    }

    if (!email || !password) {
      setHasMissingField(true)
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/accounts/new-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: ( firstname ? firstname : email),
          last_name: lastname, 
          email: email, 
          password: password, 
          confirm_password: password2, 
          account_type: role
        })
      })
    
      if (!res.ok) throw new Error(res.statusText)
      navigate('/success')

    } catch(err) {
      setHasError(true)
      console.log('Error signup ', err)
    }
  };

  // log user out if they access this page
  useEffect(() => {
    logout('/signup')
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.rolegroup}>
        <button
          className={`${styles.role} ${
            role === 'seeker' ? styles.active : ''
          } h6`}
          onClick={() => setRole('seeker')}
        >
          Seeker
        </button>

        <button
          className={`${styles.role} ${
            role === 'shelter' ? styles.active : ''
          } h6`}
          onClick={() => setRole('shelter')}
        >
          Shelter
        </button>
      
      </div>

      <Form classes={styles.form} onSubmit={handleSubmit}>
        {hasError && <p className={styles.error}>Email already taken</p>}
        {hasMissingField && <p className={styles.error}>Email and Password are necessary fields</p>}

        <h5 className='h5'>Create an account</h5>

        {role==='seeker'? (<>
          <FormField>
            <Input
              label='First Name'
              name='firstname'
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required={false}
            />
          </FormField>

          <FormField>
            <Input
              label='Last Name'
              name='lastname'
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required={false}
            />
          </FormField>
          </>) : (
            <FormField>
              <Input
                label='Shelter Name'
                name='firstname'
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required={false}
              />
            </FormField>
          )
        }

        <FormField>
          <Input
            type='email'
            label='Email'
            name='email'
            value={email}
            onChange={(e) => {
              setHasError(false)
              setHasMissingField(false)
              setEmail(e.target.value)}}
          />
        </FormField>

        <FormField>
          <Input
            type='password'
            label='Password'
            name='password'
            value={password}
            onChange={(e) => {
              setPasswordMismatch(false)
              setHasMissingField(false)
              setPassword(e.target.value)}
            }
          />
        </FormField>

        <FormField>
          { passwordMismatch && <p style={{color: '#ff9595'}}>Passwords do not match</p>}
          <Input
            type='password'
            label='Confirm Password'
            name='c_pwd'
            value={password2}
            onChange={(e) => {
              setPasswordMismatch(false)
              setHasMissingField(false)
              setPassword2(e.target.value)}
            }
            onBlur={handlePassword}
          />
        </FormField>

        <Input type='hidden' name='role' value={role} />

        
        <div className={styles.instr}>
          <Button classes={styles.btn}>Sign Up</Button>
          <p>
            Already have an account? <Link to='/login' className={styles.link}>Login</Link>
          </p>
        </div>
      </Form>
    </div>
  );
}

export default SignupForm;
