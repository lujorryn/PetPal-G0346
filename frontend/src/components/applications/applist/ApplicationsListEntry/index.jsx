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
    fetch(`${API_URL}/api/applications/${application.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({status: 'W'})
    }).then(res => { res.json() })
      .then(setStatus('Withdrawn'))
      .catch(err => console.log(err))
    
    let petlisting = application.petlisting
    petlisting.status = "AV"
    fetch(`${API_URL}/api/petlistings/${petlisting.pk}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(petlisting)
    }).then(res => { res.json() })
      .catch(err => console.log(err))
  }

  const handleApprove = (e) => {
    e.preventDefault()
    fetch(`${API_URL}/api/applications/${application.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({status: 'A'})
    }).then(res => { res.json() })
      .then(setStatus('Approved'))
      .catch(err => console.log(err))
      
    let petlisting = application.petlisting
    petlisting.status = "PE"
    fetch(`${API_URL}/api/petlistings/${petlisting.pk}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(petlisting)
    }).then(res => { res.json() })
      .catch(err => console.log(err))
  }

  const handleDecline = (e) => {
    e.preventDefault()
    fetch(`${API_URL}/api/applications/${application.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({status: 'D'})
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
            classes={`${styles.btn} ${styles.red} ${status==='Declined' || status==='Withdrawn' ? styles.disabled : ''}`}
            handleClick={handleWithdraw} disabled={status==='Declined' || status==='Withdrawn'}
          >Withdraw</Button>
        </div>
      )}
    </div>
  )
}

export default ApplicationListEntry