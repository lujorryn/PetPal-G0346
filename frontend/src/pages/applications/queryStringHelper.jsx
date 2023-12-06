
// A function to help parse through the search terms available for apps 
function getQueryString(searchTerm, page, sortCreatedTime) {

  let query_string = '';

  // Check search terms 
  if (searchTerm) {
      const parseSearchArr = searchTerm.split(' ');
      let name = '';
    
      for (let i in parseSearchArr) {
        switch (parseSearchArr[i]) {

          case 'expert':
            query_string += query_string !== '' ? '&experience=EX' : 'experience=EX';
            break;
          case 'intermediate':
            query_string += query_string !== '' ? '&experience=IN' : 'experience=IN';
            break;

          case 'pending':
            query_string += query_string !== '' ? '&status=P' : 'status=P';
            break;
          case 'accepted':
            query_string += query_string !== '' ? '&status=A' : '&status=A';
            break;
          case 'withdrawn':
            query_string += query_string !== '' ? '&status=W' : '&status=W';
            break;
          case 'denied':
            query_string += query_string !== '' ? '&status=D' : '&status=D';
            break;

          case 'email':
            query_string += query_string !== '' ? '&contact_pref=E' : 'contact_pref=E';
            break;
          case 'phone':
            query_string += query_string !== '' ? '&contact_pref=P' : 'contact_pref=P';
            break;
          case 'text':
            query_string += query_string !== '' ? '&contact_pref=T' : 'contact_pref=T';
            break;

          case 'condo':
            query_string += query_string !== '' ? '&residence_type=C' : 'residence_type=C';
            break;
          case 'apartment':
            query_string += query_string !== '' ? '&residence_type=A' : 'residence_type=A';
            break;
          case 'house':
            query_string += query_string !== '' ? '&residence_type=H' : 'residence_type=H';
            break;

          case 'children':
            query_string += query_string !== '' ? '&has_children=true' : '&has_children=true';
            break;

          default:
            if (parseSearchArr[i].includes('@')) {
              query_string += query_string !== '' ? `email=${parseSearchArr[i]}` : `email=${parseSearchArr[i]}`;
            } else {
              name += name === '' ? parseSearchArr[i] : `%20${parseSearchArr[i]}`;
            }
            break;
        }
      }

      // Check for page num 
      if (page > 1) {
        query_string += query_string !== '' ? `&page=${page}` : `page=${page}`;
      }

      // Check for sorting
      if (sortCreatedTime === false) {
        // If the query string is not empty, add '&', else don't
        query_string += query_string !== '' ? '&sort=last_updated' : 'sort=last_updated';

      } else if (sortCreatedTime === true) {
        query_string += query_string !== '' ? '&sort=last_created' : 'sort=last_created';
      }
    
      if (name !== '') {
        query_string += query_string !== '' ? `&name=${name}` : `name=${name}`;
      }
    }

    console.log("This is query_string", query_string);

    return query_string;
      
}

export default getQueryString