import { useSearchParams } from 'react-router-dom';
import ApplicationListEntry from '../ApplicationsListEntry';
import styles from './ApplicationList.module.css';

function ApplicationsList({applications, status, setStatus, setSearch, role}) {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className={styles.wrapper}>
      <div className={styles.statusgroup}>
        <button
          className={`${styles.status} ${
            status === 'active' ? styles.active : ''
          } h6`}
          onClick={() => {
            setStatus('active')
            setSearch('')
            searchParams.delete('search')
            setSearchParams(searchParams)
          }}
        >
          Pending
        </button>
        <button
          className={`${styles.status} ${
            status === '' ? styles.active : ''
          } h6`}
          onClick={() => setStatus('')}
        >
          All
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
