import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import ApplicationForm from "../../components/applications/application-form/index.jsx"
import NotFound from "../NotFound.jsx";

// "ApplicationDetail" Component
// This renders the details of a specific existing application 
function ApplicationDetail() {

    // Destructure auth variables
    const { token, userId, role } = useAuth()

    // States to store information
    const [application, setApplication] = useState(null);
    const [hasError, setHasError] = useState(false); 
    const navigate = useNavigate()

    // Individual applications 
    var application_data; 
  
    // Get the application id 
    var application_id = window.location.pathname.split('/applications/').pop().split('/')[0];

    // Fetch data when ApplicationDetail() mounts
    useEffect(() => {

     // If there is no token, navigate to the user page 
    if (!token) return navigate('/login'); 

    // Fetch data when component mounts
      fetch(`${process.env.REACT_APP_API_URL}/api/applications/${application_id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
        }).then(response => response.json())
        .then(data => {
          setApplication(data); 
        })
        .catch(error => {
          console.log(error);
          setHasError(true);
      }); 
    }, [token, navigate]);


    // There is an error (User doesn't have application with that id)
    if (application != null && application.error != undefined) {
      return <NotFound/>;
    }

  // Return a loading state if data is not yet available
  if (!application) {
    return <p>Loading application...</p>;
  }
  
  application_data = application.data || [];

  // For contact preference radio buttons
  let pref_call = false; 
  let pref_text = false;
  let pref_email = false;

  switch (application_data.contact_pref) {
    case "E":
      pref_email = true;
      break; 
    case "T":
      pref_text = true; 
      break; 
    case "C":
      pref_call = true;
      break;  
  }

  // For experience radio buttons 
  let experienced = false; 
  let intermediate_exp = false; 
  let no_exp = false; 

  switch (application_data.experience){
    case "EX":
      experienced = true; 
      break;
    case "N":
      no_exp = true; 
      break;
    case "I": 
      intermediate_exp = true;
      break; 
  }

  // For residence radio buttons 
  let condo = false; 
  let apt = false; 
  let house = false; 

  switch(application_data.residence_type) {
    case "C":
      condo = true; 
      break; 
    case "A":
      apt = true; 
      break;
    case "H":
      house = true; 
      break;
  }

  // Personal data to show in form 
  let personal_data = {
    firstName: application_data.first_name, 
    lastName: application_data.last_name,
    address: application_data.address, 
    city: "Toronto", 
    province: "ON", 
    postalCode: "10001", 
    phoneNum: application_data.phone, 
    email: application_data.email, 
    pref_call: pref_call, 
    pref_text: pref_text, 
    pref_email: pref_email, 
    pet_num: application_data.pet_number,
    has_children: application_data.has_children, 
    experienced: experienced, 
    intermediate: intermediate_exp, 
    no_exp: no_exp, 
    condo: condo, 
    apt: apt, 
    house: house, 
  }

  return (
    <div className="main__container">
      <ApplicationForm 
        readOnly={true} 
        is_disabled={true} 
        data={personal_data} 
        button_text={"Return"}
        is_active_app={(application_data.status === 'P' || application_data.status === 'A') && role === 'shelter'}
        handlePet={() => navigate(`/petlistings/${application_data.petlisting.pk}`)}
        handleUserProfile={() => navigate(`/profile/${application_data.seeker}`)}
        handleClick={() => navigate("/applications")}
        />
    </div>

  )
}

export default ApplicationDetail
