// Function used to validate application form 
// TODO: GET THE SHELTER THAT HAS PET_ID
function validateForm(method, formData, pet_id) {

    console.log("Inside validateForm");
    let error_msg = "";

    console.log(formData);

    // Check that no input is empty
    for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
        const [field_name, value] = pair;

        if (value.trim() === '') {
            error_msg = 'All fields are required and none must be empty'
            return error_msg;
          }
    }

    // Get first-name, last-name
    let first_name = formData.get("first-name").trim(); 
    let last_name = formData.get("last-name").trim();
    // Get address, city, province, postal-code
    let address = formData.get("address").trim();
    let city = formData.get("city").trim();
    let postal_code = formData.get("postal-code").trim(); 

    // Validate phone (format)
    let phone = formData.get("phone").trim();
    let phone_regex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phone_regex.test(phone)) {
        console.log("error");
        error_msg = 'Invalid phone format';
        return error_msg;
    }
    // Validate user-email 
    let email = formData.get("user-email").trim();
    let email_regex = /^(?!.*\.\.)[\w-\.!+%]+@([a-zA-Z0-9-]+\.)+[\w]+$/;
    if (!email_regex.test(email)) {
        error_msg = 'Invalid email';
        return error_msg;
    }

    // Check contact-preference
    let contact_pref = formData.get("contact-preference").trim();
    if (contact_pref == null) {
        error_msg = 'Please select your preferred method of contact';
        return error_msg;
    } else {
        switch (contact_pref) {
            case "phone-call":
              contact_pref = 'C';
              break;
            case "text":
                contact_pref = 'T';
                break;
            case "email":
                contact_pref = 'E';
                break;
            default:
              error_msg = 'Invaild contact preference'
              return error_msg;
          }
    }

    // Check number-of-pets
    let num_pets = parseInt(formData.get("number-of-pets"));
    if (num_pets < 0 || num_pets == null) {
        error_msg = 'Invalid number of pets';
        return error_msg;
    } 

    // Check children
    let has_children = formData.get("children");
    if (has_children == null) {
        error_msg = 'Please select whether you have children or not';
        return error_msg;
    } else {
        switch (has_children) {
            case "no":
                has_children = false;
                break;
            case "yes":
                has_children = true;
                break;
            default:
                error_msg = 'Invaild children'
                return error_msg;
        }

    }

    // Check pet-experience
    let experience_lvl = formData.get("pet-experience");
    if (experience_lvl == null) {
        error_msg = 'Please disclose your experience with pets';
        return error_msg;
    } else {
        switch (experience_lvl) {
            case "experienced":
              experience_lvl = 'EX';
              break;
            case "intermediate":
                experience_lvl = 'I';
                break;
            case "no-experience":
                experience_lvl = 'N';
                break;
            default:
              error_msg = 'Invalid experience level';
              return error_msg;
          }
    }

    // Check housing-type 
    let housing = formData.get("housing-type");
    if (housing == null) {
        error_msg = 'Please select your residence type';
        return error_msg;
    } else {
        switch (housing) {
            case "condo":
              housing = 'C';
              break;
            case "apartment":
                housing = 'A';
                break;
            case "house":
                housing = 'H';
                break;
            default:
              error_msg = 'Invalid residence type';
              return error_msg;
          }

    }
    
    // Success: Make a POST request to the backend and navigate to success page.
    // To make a fetch: go to the endpoint /api/petlistings/<int:pet_id> GET to
    if (method == "POST") {
        // Fetch post request 
    } 


    
}

export default validateForm;