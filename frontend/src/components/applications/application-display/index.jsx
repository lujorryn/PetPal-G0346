import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../../ui/Button/index.jsx'
import CorrespondenceRow from '../correspondence-row/index.jsx'
import Pagination from '../../ui/Pagination/index.jsx';

/* Component to display an application */ 
// TODO: FIX PAGINATION 
function ApplicationDisplay ({applications, onWithdrawDenyBtn, onAcceptBtn, role, setPage, setClaimNext}) {
    const navigate = useNavigate();
    const applications_data = applications.results.data; 

    const [showAllApps, setShowAllApps] = useState(false); 

    // Pagination
    const next_page = applications ? applications.next : null;
    const prev_page = applications ? applications.previous : null;
    const curr = applications ? applications.current_page : null;
    const [totalPages, setTotalPages] = useState(applications ? applications.total_pages : 0);

    // If there are no applications in curr, move to the next one.
    useEffect(() => {
        if (!applications_data.some(application => application.status === 'P' || application.status === 'A') && showAllApps === false) {
        //   if (totalPages > 1) {
        //     setClaimNext(true);
        //     setTotalPages(prevTotalPages => prevTotalPages - 1);
            // }
            if (next_page != null) {
                setClaimNext(true);
          }
        }
      }, [applications_data, showAllApps]);

    // console.log("This is applications_data", applications_data);

    // Show active apps only
    const handleActiveClick = () => {
        setShowAllApps(false);
    };

    // Shows all apps
    const handleAllClick = () => {
        setShowAllApps(true);
    };

    // Format date function
    function formatDate(date) {
        return new Date(date).toLocaleString();
    }

    useEffect(() => {
        setPage(1);
    },[showAllApps])

    return (
        <>
            <>
                <div className="title-row">
                    <p className="page-title"> My Applications </p>
                    <span id="new-btn"><Button classes={"btn"} children={"Find another pet"} handleClick={() => navigate("/petlistings")}/> </span>
                </div>
                <div className="msg-container">
                    <div className="msg-nav">
                    <button id="inbox" className={`msg-nav-item ${!showAllApps ? 'active': ''}`} onClick={handleActiveClick}> Active Apps </button>
                    <button id="inbox" className={`msg-nav-item ${showAllApps ? 'active': ''}`} onClick={handleAllClick}> All </button>
                    </div>
                    {applications_data.map(application => (
                    <CorrespondenceRow 
                        key={application.id} 
                        subject={application.first_name} 
                        from={application.email} 
                        preview={
                        application.status === 'W' ? `Application #${application.id} Withdrawn` : 
                        application.status === 'A' ? `Application #${application.id} Accepted` : 
                        application.status === "D" ? `Application #${application.id} Denied` : 
                        application.status === "P" ? `Application #${application.id} Pending`:
                        `Application #${application.id}`
                        }  
                        timestamp={formatDate(application.last_updated)}
                        handleViewBtn={() => navigate(`/applications/${application.id}/`)} 
                        handleWDBtn={onWithdrawDenyBtn}
                        is_app={true}
                        is_seeker={ role === 'shelter' ? true: false}
                        handleAcceptBtn={ role === 'shelter' ? onAcceptBtn : null}
                        isHidden={!showAllApps && (application.status === 'W' || application.status === 'D' || application.status === 'A' )}
                        />
                    ))}
                </div>
            </>
            <Pagination next={next_page} prev={prev_page} curr={curr} total_pages={totalPages} setPage={setPage} />
        </>
    )
}

export default ApplicationDisplay;