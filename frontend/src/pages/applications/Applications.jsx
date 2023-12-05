import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import CorrespondenceRow from "../../components/applications/correspondence-row/index.jsx"
import Button from "../../components/ui/Button/index.jsx"
import { withdrawApp, denyApp, acceptApp } from "./withdrawDenyApp.jsx";

//TODO:
// - Sort and filter
//    - created_time / last_updated
//      descending only
// - Pagination

// "Applications" List component
// This renders all of the applications associated with the user. 
function Applications() {

  // Destructure auth variables
  const { token, userId, role } = useAuth()

  // States to store information
  const [applications, setApplications] = useState(null);
  const navigate = useNavigate()
  const [showClosed, setShowClosed] = useState(false); 

  // Individual applications 
  var applications_data = []; 

  // Fetch data when Applications() mounts
  useEffect(() => {
      console.log("Applications useEffect"); 

     // If there is no token, navigate to the user page 
     if (!token) return navigate('/login'); 

    // Fetch data when component mounts
    fetch(`${process.env.REACT_APP_API_URL}/api/applications`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => response.json())
      .then(data => {
        setApplications(data); 
      })
      .catch(error => console.log(error)); 

    }, [token, navigate]);

    // (For testing purposes) Check the response
    useEffect(() => {
      console.log(applications);
      if (applications != null) {
        console.log("This is results");
        console.log(applications.results); 

        console.log("This is data (To use for Application Detail View)"); 
        console.log(applications.results.data);

        applications_data = applications.results.data; 
        console.log("This is applications_data: " + applications_data);
        console.log(applications_data);

        // Test to get a specific value in a data 
        console.log(applications_data[0].email);

        // Test to see if its an array...
        console.log(Array.isArray(applications_data));

      }

    }, [applications]);

  // Loading msg
  if (!applications) {
    return <p>Loading applications...</p>;
  }
  
  applications_data = applications.results.data || [];

  // Button to deny or withdraw an application 
  const onWithdrawDenyBtn = (event) => {
    // To get application id, get .msg-preview
    let msgRow = event.target.closest('.msg-row');
    let app_id;

    if (msgRow) {
      // Find the "msg-preview" element within the "msg-row"
      const msgPreview = msgRow.querySelector('.msg-preview');
      console.log(msgPreview);
      // Get the application ID from msgContext
      const msgContent = msgPreview.textContent;
      app_id = parseInt(msgContent.match(/\d+/)[0]);
    }

    if (role === 'seeker' && app_id != undefined) {
      withdrawApp(token, app_id);
      console.log("Withdrew App");

      return window.location.reload();


    } else if (role === 'shelter') {
      denyApp(token, app_id);
      console.log("Denied an app");

      return window.location.reload();

    }
  }

  // Function to accept application.
  const onAcceptBtn = (event) => {
    // To get application id, get .msg-preview
    let msgRow = event.target.closest('.msg-row');
    let app_id;

    if (msgRow) {
      // Find the "msg-preview" element within the "msg-row"
      const msgPreview = msgRow.querySelector('.msg-preview');
      console.log(msgPreview);
      // Get the application ID from msgContext
      const msgContent = msgPreview.textContent;
      app_id = parseInt(msgContent.match(/\d+/)[0]);

      if (role === 'shelter') {
        acceptApp(token, app_id);
        console.log("Accepted an app");
  
        return window.location.reload();
      }
    }
  }

  // Handle the tabs 
  const handleActiveClick = () => {
    setShowClosed(false);
  };

  const handleClosedClick = () => {
    setShowClosed(true);
  };

  // Format date function 
  function formatDate(date) {
    return new Date(date).toLocaleString();
  }

  return (
    <div className="main__wrapper">
      <div className="title-row">
        <p class="page-title"> My Applications </p>
        <span id="new-btn"><Button classes={"btn"} children={"Find another pet"} handleClick={() => navigate("/petlistings")}/> </span>
      </div>
      <div className="msg-container">
        <div className="msg-nav">
          <button id="inbox" className={`msg-nav-item ${!showClosed ? 'active': ''}`} onClick={handleActiveClick}> Active Apps </button>
          <button id="inbox" className={`msg-nav-item ${showClosed ? 'active': ''}`} onClick={handleClosedClick}> All </button>
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
            isHidden={!showClosed && (application.status === 'W' || application.status === 'D')}
            />
        ))}
      </div>
    </div>

  );
}

export default Applications
