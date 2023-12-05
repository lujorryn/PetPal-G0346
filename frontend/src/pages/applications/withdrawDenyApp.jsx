// Function that withdraws a seeker application 
export function withdrawApp (token, app_id) {

    // Prepare Payload 
    const form_data = new FormData();
    form_data.append('status', 'W');

    fetch(`${process.env.REACT_APP_API_URL}/api/applications/${app_id}`, {
        method: 'PUT', 
        headers: {
            Authorization: `Bearer ${token}`
        }, 
        body: form_data,
    }).then(response => response.json())
    .then(data => {
        console.log(data);
    }).catch(error => console.log(error));

}

// Function that denies a seeker application
export function denyApp (token, app_id) {

    // Prepare Payload 
    const form_data = new FormData();
    form_data.append('status', 'D');

    fetch(`${process.env.REACT_APP_API_URL}/api/applications/${app_id}`, {
        method: 'PUT', 
        headers: {
            Authorization: `Bearer ${token}`
        }, 
        body: form_data,
    }).then(response => response.json())
    .then(data => {
        console.log(data);
    }).catch(error => console.log(error));

}
