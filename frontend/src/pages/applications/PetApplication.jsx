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
// 3. (OKA) Show the form and validate their form inputs. 

//TODO: 
// - Navigate to success screen 
// - GET PET STATUS

/* Component to show an empty form if the seeker has not applied to this pet yet */ 
function PetApplication () {

    // The data in the form is blank 
    // let personal_data = {
    //     firstName: '', 
    //     lastName: '',
    //     address: '', 
    //     city: "", 
    //     province: "", 
    //     postalCode: "", 
    //     phoneNum: '', 
    //     email: '', 
    //     pref_call: '', 
    //     pref_text: '', 
    //     pref_email: '', 
    //     pet_num: '',
    //     has_children: '', 
    //     experienced: '', 
    //     intermediate: '', 
    //     no_exp: '', 
    //     condo: '', 
    //     apt: '', 
    //     house: '', 
    //   };
  
      // To test: 
      let personal_data = {
        firstName: 'John', 
        lastName: 'Doe',
        address: 'Help', 
        city: "Tampa", 
        province: "FL", 
        postalCode: "123214", 
        phoneNum: '123-123-1234', 
        email: 'seeker1@example.com', 
        pref_call: false, 
        pref_text: false, 
        pref_email: true, 
        pet_num: 1,
        has_children: false, 
        experienced: true, 
        intermediate: false, 
        no_exp: false, 
        condo: true, 
        apt: false, 
        house: false, 
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

    // Check to see the status of the pet
    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/api/petlistings/${pet_id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
      }).then(response => response.json())
      .then(data => {
        console.log("PET STATUS", data.data.status);
        if (data.data.status != 'AV') {
          setErrorMsg("You can only apply for pets with Status: Available");
          setIsReadOnly(true);
          setFirstFetchError(true); // Set the error flag
        }
        }).catch( error => console.log(error));
      });

  useEffect(() => {
    if (isReady && validData && validData.firstName !== '' && !firstFetchError) {
      console.log("ValidData", validData);
  
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
          // console.log(validData);
          console.log("Error with application POST request");
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
          console.log(validation_result);
          if (validation_result.first_name != '') {
            console.log("This is validation res", validation_result);

            setValidData(validation_result);
            setIsReady(true);
          }
        }
    }

    //applications_data = applications.results.data || [];

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