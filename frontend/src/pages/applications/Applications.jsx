import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import CorrespondenceRow from "../../components/applications/correspondence-row/index.jsx"
import Button from "../../components/ui/Button/index.jsx"
import { withdrawApp, denyApp, acceptApp } from "./updateAppStatus.jsx";
import Pagination from "../../components/ui/Pagination/index.jsx";
import ApplicationDisplay from "../../components/applications/application-display/index.jsx"

// Component for the list applications page
function Applications() {

  // Destructure auth variables
  const { token, userId, role } = useAuth()

  // States
  const [applications, setApplications] = useState(null);
  const navigate = useNavigate();
  const [endPoint, setEndPoint] = useState(`/api/applications`)
  const [page, setPage] = useState(1); 

  // If there are no apps in the current window, 
  // See if there are more in other windows. 
  const [claimNext, setClaimNext] = useState('')

  // Get data
  useEffect(() => {
      console.log("Applications useEffect"); 

     // If there is no token, navigate to the user page 
     if (!token) return navigate('/login'); 

    // Fetch data when component mounts
    fetch(`${process.env.REACT_APP_API_URL}${endPoint}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`}})
      .then(response => response.json())
      .then(data => {
        setApplications(data); 
      })
      .catch(error => console.log(error)); 

    }, [token, endPoint, navigate]);

  // Change endpoint if page changes
  useEffect(() => {
    console.log("This is app page:", page);
    if (page > 1) {
      setEndPoint(prevEndPoint => `/api/applications?page=${page}`);
    } else {
      setEndPoint(prevEndPoint => `/api/applications`);
    }

    if (claimNext == true){
      if (applications.next != null && page < applications.total_pages && page > 0) {
        console.log(applications.next); 
        setPage(parseInt(page) + 1); 
        setClaimNext(false);
      }
    }

  }, [page, claimNext]);

  // Loading msg
  if (!applications) {
    return <p>Loading applications...</p>;
  }
  
  // Handles button to deny or withdraw an application 
  const onWithdrawDenyBtn = (event) => {
    // To get application id, get .msg-preview
    let msgRow = event.target.closest('.msg-row');
    let app_id;

    if (msgRow) {
      // Find the "msg-preview" element within the "msg-row"
      const msgPreview = msgRow.querySelector('.msg-preview');
      // console.log(msgPreview);
      // Get the application ID from msgContext
      const msgContent = msgPreview.textContent;
      app_id = parseInt(msgContent.match(/\d+/)[0]);
    }

    if (role === 'seeker' && app_id != undefined) {
      withdrawApp(token, app_id);
      console.log("Withdrew App");

      return window.location.reload();


    } else if (role === 'shelter' && app_id != undefined) {
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

  // Render component
  if (applications != null) {
    // console.log("This is applications data", applications);
    return (
      <div className="main__wrapper">
        <ApplicationDisplay 
          applications={applications} 
          onWithdrawDenyBtn={onWithdrawDenyBtn} 
          onAcceptBtn={onAcceptBtn}
          role = {role}
          page = {page}
          setPage = {setPage}
          setClaimNext = {setClaimNext}
        />
      </div>)
  }
}

export default Applications