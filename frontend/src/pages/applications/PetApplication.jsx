import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotFound from "../NotFound";
import ApplicationForm from "../../components/applications/application-form";
import validateForm from "./validateForm.jsx" 

// Idea: 
// 1. (OK) Check that the user is a seeker.
//  - What should the behaviour be if a shelter types in this url? 
//        - Made it so that it navigates back to petlisting (Consider changing it to 404 Not Found)
// 2. (OK) If a seeker, check that they have not applied to this pet yet.
//      - If they have applied to this pet, navigate to the applications/:appId page. 
// 3. Show the form and validate their form inputs. 

//TODO: 
// - Handle Submit 
// - Validate user inputs (Use Formik?)
// - Navigate to success screen 

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
    const [formData, setFormData] = useState(personal_data);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate()

    // Array of applications related to user
    var applications_data = []; 

    // Get id of pet 
    var pet_id = window.location.pathname.split('/petlistings/').pop().split('/apply')[0];

    // Fetch user's prev applications when PetApplication dismounts
    useEffect(() => {
        console.log("PetApplication useEffect"); 
  
       // If there is no token, navigate to the user page
       // If the user is a shelter, redirect to Home 
       if (!token) {
        return navigate('/login'); 
       } else if (role === 'shelter') {
        return navigate('/');
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

    // Check to see if user already has an app for this pet.
    useEffect(() => {
        if (applications != null) {
            applications_data = applications.results.data; 
            if (applications_data.some(application => application.petlisting == pet_id)) {
                let app_id = applications_data.find(app => app.petlisting == pet_id);
                if (app_id){
                    return navigate(`/applications/${app_id.id}`);
                } 
            }
        }

    }, [applications, pet_id, navigate]);

    if (!applications || applications == undefined) {
        return <p>Checking applications...</p>;
    }

    var error_msg = "";
    // If Submit, validate form
    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)

        setErrorMsg(validateForm("POST", formData, pet_id)); 
        
        console.log(error_msg);
    }

    //applications_data = applications.results.data || [];

    return (
        // <div>Application Detail {application_id} </div>
        <div className="main__container">
          <ApplicationForm 
            readOnly={false} 
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