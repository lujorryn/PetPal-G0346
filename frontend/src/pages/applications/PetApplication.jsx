import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationForm from "../../components/applications/application-form";
import validateForm from "./validateForm.jsx" 

/* Component to show an empty form if the seeker has not applied to this pet yet */ 
function PetApplication () {

    // The data in the form is blank 
    let personal_data = {
        firstName: '', 
        lastName: '',
        address: '', 
        city: "", 
        province: "", 
        postalCode: "", 
        phoneNum: '', 
        email: '', 
        pref_call: '', 
        pref_text: '', 
        pref_email: '', 
        pet_num: '',
        has_children: '', 
        experienced: '', 
        intermediate: '', 
        no_exp: '', 
        condo: '', 
        apt: '', 
        house: '', 
      };

    const { token, userId, role } = useAuth()

    // States to store information
    const [applications, setApplications] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [validData, setValidData] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [firstFetchError, setFirstFetchError] = useState(false);

    const navigate = useNavigate()

    // Array of applications related to user
    var applications_data = []; 

    // Get id of pet 
    var pet_id = window.location.pathname.split('/petlistings/').pop().split('/apply')[0];

    // Fetch user's prev applications when PetApplication dismounts
    useEffect(() => {  
       // If there is no token, navigate to the user page
       // If the user is a shelter, redirect to 404-not-found
       if (!token) {
        return navigate('/login'); 
       } else if (role === 'shelter') {
        return navigate('404-not-found');
       }
         
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

  // Check to see the status of the pet
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/petlistings/${pet_id}`, {
      method: 'GET',
      headers: {
          Authorization: `Bearer ${token}`,
      },
    }).then(response => response.json())
    .then(data => {
      if (data.data.status != 'AV') {
        setErrorMsg("You can only apply for pets with Status: Available");
        setIsReadOnly(true);
        setFirstFetchError(true); // Set the error flag
      }
      }).catch( error => console.log(error));
    });


  // Make POST request
  useEffect(() => {
    if (isReady && validData && validData.firstName !== '' && !firstFetchError) {

      let form_data = new FormData();
  
      for (var key in validData) {
        form_data.append(key, validData[key]);
      }
  
      fetch(`${process.env.REACT_APP_API_URL}/api/applications`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form_data,
      }).then(response => {
        if (!response.ok) {
          return navigate(`/petlistings/already-applied`, { replace: true });
        } else {
          return navigate(`/petlistings/application-success`, { replace: true });
        }
      }).catch(error => {
        console.log(error);
      });
    }
  }, [isReady, validData, navigate, token]);
  

    if (!applications || applications == undefined) {
        return <p>Checking applications...</p>;
    }

    // If Submit, validate form
    const onSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)

        let validation_result = validateForm("POST", formData, pet_id, token)

        if (typeof validation_result === 'string') {
          setErrorMsg(validation_result);
        } else {
          if (validation_result.first_name != '') {

            setValidData(validation_result);
            setIsReady(true);
          }
        }
    }

    return (
        // <div>Application Detail {application_id} </div>
        <div className="main__container">
          <ApplicationForm 
            readOnly={isReadOnly} 
            is_disabled={false} 
            data={personal_data} 
            button_text={"Submit"} 
            handleClick={onSubmit}
            on_submit={onSubmit}
            error={errorMsg}
            />
        </div>
    
      )
}

export default PetApplication