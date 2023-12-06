import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import CorrespondenceRow from "../../components/applications/correspondence-row/index.jsx"
import Button from "../../components/ui/Button/index.jsx"
import { withdrawApp, denyApp, acceptApp } from "./updateAppStatus.jsx";
import Pagination from "../../components/ui/Pagination/index.jsx";
import ApplicationDisplay from "../../components/applications/application-display/index.jsx"
import ApplicationSort from "../../components/applications/application-sort/index.jsx";
import SearchBar from "../../components/applications/application-searchbar/index.jsx";
import getQueryString from "./queryStringHelper.jsx";
import { useFetch } from "../../hooks/useFetch.js";

//STARTED TO CHANGE HERE 
// Component for the list applications page
function Applications() {

  // Destructure auth variables
  const { token, userId, role } = useAuth();

  // States
  const [applications, setApplications] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1); 
  const [ sortCreatedTime, setSortCreatedTime ] = useState(false); 

  // If there are no apps in the current window, see if there are more in other windows. 
  const [claimNext, setClaimNext] = useState('');

  // Search bar states
  const [searchParams, _] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search'));
  const [endPoint, setEndPoint] = useState(`/api/applications`);
  const [query, setQuery] = useState('')

  const [isPending, setIsPending] = useState(false);
  const [failedSearchMsg, setFailedSearchMsg] = useState(''); 

  // Fetch data
  // Why did it not work if i used fetch() ? 
  const { data } = useFetch(endPoint, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Listen for search parameters
  useEffect(() => {
    const searchTerm = searchParams.get('search')
    setSearchTerm(searchTerm)
    setPage(1);
  }, [searchParams, isPending]);


  // Get query string
  let query_string;
  useEffect(() => {

    // Get string for query
    query_string = getQueryString(searchTerm, page, sortCreatedTime, isPending);

    setQuery(query_string);

  }, [page, claimNext, sortCreatedTime, searchTerm]);

  // Send query to the backend
  useEffect(() => {
    if(query !== '') {
      setEndPoint(`/api/applications?${query}`);
      // if (query.includes('name')){
      //   setFailedSearchMsg('Your search yielded no results');
      // }
      console.log('This is the endpoint:',`/api/applications?${query}` );
    }
    else setEndPoint(`/api/applications`);
  }, [query]);


  // Handles button to deny or withdraw an application 
  const onWithdrawDenyBtn = (event) => {
    // To get application id, get .msg-preview
    let msgRow = event.target.closest('.msg-row');
    let app_id;

    if (msgRow) {
      // Find the "msg-preview" element within the "msg-row"
      const msgPreview = msgRow.querySelector('.msg-preview');

      // Get the application ID from msgContext
      const msgContent = msgPreview.textContent;
      app_id = parseInt(msgContent.match(/\d+/)[0]);
    }

    if (role === 'seeker' && app_id != undefined) {
      withdrawApp(token, app_id);
      console.log("Withdrew App");
      setPage(1); 

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
  if (data != null) {
    return (
      <div className="main__wrapper">
        <SearchBar searchTerm={searchTerm}/>
        <div> {failedSearchMsg} </div>
        <ApplicationSort setSortCreatedTime={setSortCreatedTime} sortCreatedTime={sortCreatedTime} />
        <ApplicationDisplay 
          applications={data} 
          onWithdrawDenyBtn={onWithdrawDenyBtn} 
          onAcceptBtn={onAcceptBtn}
          role = {role}
          page = {page}
          setPage = {setPage}
          setClaimNext = {setClaimNext}
          setIsPending = {setIsPending}
          queryString = {query}
        />
      </div>)
  }
}

export default Applications