import styles from './ApplicationListEntry.module.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

import Button from '../../../ui/Button'
import { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL

function ApplicationListEntry({application, isOdd, role}) {
  const { token } = useAuth()
  const statusDict = {"A": "Approved", "P": "Pending", "W": "Withdrawn", "D": "Declined"}
  const [status, setStatus] = useState(statusDict[application? application.status : "P"])
  const formatDate = (date) => new Date(date).toLocaleString();
  const navigate = useNavigate()

  const handleWithdraw = (e) => {
    e.preventDefault()
    const payload = {
      status: 'W',
      petlisting_id: application.id
    }
    fetch(`${API_URL}/api/applications/${application.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(res => { res.json() })
      .then(setStatus('Withdrawn'))
      .catch(err => console.log(err))
  }

  const handleApprove = (e) => {
    e.preventDefault()
    const payload = {
      status: 'A',
      petlisting_id: application.id
    }
    fetch(`${API_URL}/api/applications/${application.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(res => { res.json() })
      .then(setStatus('Approved'))
      .catch(err => console.log(err))
  }

  const handleDecline = (e) => {
    e.preventDefault()
    console.log("decline")
    const payload = {
      status: 'D',
      petlisting_id: application.id
    }
    fetch(`${API_URL}/api/applications/${application.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(res => { res.json() })
      .then(setStatus('Declined'))
      .catch(err => console.log(err))
  }

  const handleNavigate = (e) => {
    e.preventDefault()
    return navigate(`/applications/${application.id}`)
  }

  return (
    <div className={`${styles.wrapper} ${isOdd ? styles.odd : styles.even}`}>
      <div className={styles.info}>
        <h6 className='h6'>{application?.first_name}'s Application for {application?.petlisting.name}</h6>
        <p>Application #{application?.id} {status}</p>
        <p className={styles.date}>Submitted {formatDate(application?.created_time)}</p>
        <p className={styles.date}>Updated {formatDate(application?.last_updated)}</p>
      </div>
      {role === 'shelter' ? (
        <div className={styles.buttons}>
          <Button classes={`${styles.btn}`} handleClick={handleNavigate}>View</Button>
          <Button 
            classes={`${styles.btn} ${styles.green} ${status!=='Pending' ? styles.disabled : ''}`}
            handleClick={handleApprove} disabled={status!=='Pending'}
          >Approve</Button>
          <Button
            classes={`${styles.btn} ${styles.red} ${status!=='Pending' ? styles.disabled : ''}`}
            handleClick={handleDecline} disabled={status!=='Pending'}
          >Decline</Button>
        </div>
      ) : (
        <div className={styles.buttons}>
          <Button classes={`${styles.btn}`} handleClick={handleNavigate}>View</Button>
          <Button
            classes={`${styles.btn} ${styles.red} ${status!=='Pending' ? styles.disabled : ''}`}
            handleClick={handleWithdraw} disabled={status!=='Pending'}
          >Withdraw</Button>
        </div>
      )}
    </div>
  )
}

export default ApplicationListEntry