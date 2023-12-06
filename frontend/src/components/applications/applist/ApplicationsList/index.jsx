import { useSearchParams } from 'react-router-dom';
import ApplicationListEntry from '../ApplicationsListEntry';
import styles from './ApplicationList.module.css';
import { useState } from 'react';

function ApplicationsList({applications, status, setStatus, role}) {
  const [appStatus, setAppStatus] = useState(status)
  return (
    <div className={styles.wrapper}>
      <div className={styles.statusgroup}>
        <button
          className={`${styles.status} ${
            status === '' ? styles.active : ''
          } h6`}
          onClick={() => {
            setStatus('')
            setAppStatus('')
          }}
        >
          All
        </button>
        <button
          className={`${styles.status} ${
            status === 'P' ? styles.active : ''
          } h6`}
          onClick={() => {
            setStatus('P')
            setAppStatus('P')
          }}
        >
          Pending
        </button>
        
      </div>  
      <div className={styles.entries}>
        { applications.length > 0 ? (
          <>
            { applications.map((application, index) => {
              return <ApplicationListEntry
                key={application.id}
                application={application}
                isOdd={index % 2 === 1 ? true : false}
                role={role}
              />
            })}
          </>
        ) : (
          <p className={styles.empty}>No Applications</p>
        )}
      </div>    
    </div>
  );
}

export default ApplicationsList;
