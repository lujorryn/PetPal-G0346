// Function used to validate application form 
function validateForm(method, formData, pet_id, token) {

    let error_msg = "";

    // Check that no input is empty
    for (const pair of formData.entries()) {
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
              contact_pref = 'P';
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
                experience_lvl = 'IN';
                break;
            case "no-experience":
                experience_lvl = 'NE';
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
    
    let payload;
    payload = {
        'first_name': first_name, 
        'last_name': last_name, 
        'address': address, 
        'phone': phone, 
        'email': email, 
        'contact_pref': contact_pref, 
        'pet_number': num_pets, 
        'has_children': has_children, 
        'experience': experience_lvl, 
        'residence_type': housing, 
        'petlisting_id': pet_id,
        'status': "P", 
    }

    if (method == "POST" && error_msg === "") {

        return payload; 
                
    } 
}

export default validateForm;