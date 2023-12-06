import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../../ui/Button/index.jsx'
import CorrespondenceRow from '../correspondence-row/index.jsx'
import Pagination from './AppPagination.jsx'
// import Pagination from '../../ui/Pagination/index.jsx';

/* Component to display an application */ 
function ApplicationDisplay ({applications, onWithdrawDenyBtn, onAcceptBtn, role, setPage, setClaimNext, setIsPending, queryString}) {
    const navigate = useNavigate();

    const applications_data = applications.results.data; 
    const [showAllApps, setShowAllApps] = useState(true); 

    // Pagination
    const next_page = applications ? applications.next : null;
    const prev_page = applications ? applications.previous : null;
    const curr = applications ? applications.current_page : null;
    const [totalPages, setTotalPages] = useState(applications ? applications.total_pages : 0);

    // Show active apps only
    const handleActiveClick = () => {
        setShowAllApps(false);
        setIsPending(true);
        console.log("Set pending to true");
    };

    // Shows all apps
    const handleAllClick = () => {
        setShowAllApps(true);
        setIsPending(false);
        console.log("Set pending to false");
    };

    // Format date function
    function formatDate(date) {
        return new Date(date).toLocaleString();
    }

    // Reset pages if switching 
    useEffect(() => {
        setPage(1);
    },[showAllApps])

    // Show search not found 
    let errorMsg = '';
    if (queryString.includes('name') || applications.results.data.length === 0){
        errorMsg = 'Your search yielded no results';
        return (
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
                </div>
                <div> {errorMsg} </div>
            </>
        )
    }

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
                        application.status === 'W' ? `Application ID#${application.id} Withdrawn` : 
                        application.status === 'A' ? `Application ID#${application.id} Accepted` : 
                        application.status === "D" ? `Application ID#${application.id} Denied` : 
                        application.status === "P" ? `Application ID#${application.id} Pending`:
                        `Application #${application.id}`
                        }  
                        timestamp={formatDate(application.last_updated)}
                        handleViewBtn={() => navigate(`/applications/${application.id}/`)} 
                        handleWDBtn={onWithdrawDenyBtn}
                        is_app={true}
                        is_seeker={ role === 'shelter' ? true: false}
                        handleAcceptBtn={ role === 'shelter' ? onAcceptBtn : null}
                        // isHidden={!showAllApps && (application.status === 'W' || application.status === 'D' || application.status === 'A' )}
                        />
                    ))}
                </div>
            </>
            <Pagination next={next_page} prev={prev_page} curr={curr} total_pages={totalPages} setPage={setPage} />
        </>
    )
}

export default ApplicationDisplay;
  