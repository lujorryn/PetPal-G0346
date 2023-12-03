import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import CorrespondenceRow from "../../components/applications/correspondence-row/index.jsx"
import Button from "../../components/ui/Button/index.jsx"

// TODO:
// 
// - Get pet name to add to title or message preview 
// - Put the last_updated time in a fully readable format 
// - Make Pending/Active buttons change
// - (OK) Make "Find another pet" link to another page
// - (OK) Make "View" link to actual application page 

// "Applications" component
// This renders all of the applications associated with the user. 
function Applications() {

  // Destructure auth variables
  const { token, userId, role } = useAuth()

  // States to store information
  const [applications, setApplications] = useState(null);
  const navigate = useNavigate()

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
        // console.log("After setApplication");
        // console.log(application);
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

  // Return a loading state if data is not yet available
  if (!applications) {
    return <p>Loading applications...</p>;
  }
  
  applications_data = applications.results.data || [];

  return (
    <div className="main__wrapper">
      <div className="title-row">
        <p class="page-title"> My Applications </p>
        {/* Maybe use button component instead */}
        {/* <a id="new-btn" className="btn">Find another pet</a> */}
        <span id="new-btn"><Button classes={"btn"} children={"Find another pet"} handleClick={() => navigate("/petlistings")}/> </span>
      </div>
      <div className="msg-container">
        <div className="msg-nav">
          <button id="inbox" className="msg-nav-item active"> Pending </button>
          <button id="inbox" className="msg-nav-item"> Approved </button>
        </div>
        {applications_data.map(application => (
          <CorrespondenceRow 
            key={application.id} 
            subject={application.first_name} 
            from={application.email} 
            preview={"Application"} 
            timestamp={application.last_updated}
            handleClick={() => navigate(`/applications/${application.id}/`)} 
            />
        ))}
      </div>
    </div>

  );
}

export default Applications
