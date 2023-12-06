import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

import '../../styles/reset.css';
import '../../styles/global.css';
import './PetDetail.css';

import Button from '../../components/ui/Button';
import { containerClasses } from '@mui/material';


function PetDetail() {
  const { token, userId, role } = useAuth();
  const [listingData, setListingData] = useState([]);
  const [shelterData, setShelterData] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const { petId } = useParams();
  const navigate = useNavigate();

  const breedMap = (b) => {
    if (b === "N/A" || b === "") {
      return "not specified";
    } else {
      return b;
    }
  }
  const statusMap = {
    "AV": "Available",
    "AD": "Adopted",
    "PE": "Pending",
    "WI": "Withdrawn"
  }
  const sizeMap = {
    "S": "Small",
    "M": "Medium",
    "L": "Large",
  }
  const sexMap = {
    "M": "Male",
    "F": "Female",
    "X": "Unknown",
  }


  const listingUrl = `${process.env.REACT_APP_API_URL}/api/petlistings/${petId}`;

  // upon page load: fetch petlisting and shelter
  useEffect(() => {
    const getReqContent = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': "application/json",
      }
    }

    const fetchAllData = async () => {
      try {
        const petlisting = await getPetlisting();
        setListingData(petlisting);

        const listingOwner = await getListingOwner(petlisting.owner);
        setShelterData(listingOwner);

      } catch (err) {
        setErr(err.message);
        console.log("Uh oh =>", err);
      }

      setLoading(false);
    }

    const getPetlisting = async () => {
      const res = await fetch(listingUrl, getReqContent);

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      const listing = await res.json();
      return listing.data;
    }

    const getListingOwner = async (email) => {
      const allShelters = [];
      let hasNext = true;
      let page = 1;
      while (hasNext) {
        let shelterUrl = `${process.env.REACT_APP_API_URL}/api/shelters?page=${page}`;
        const res = await fetch(shelterUrl, getReqContent);

        if (res.status != 200) {
          throw new Error(res.statusText);
        }

        const shelters = await res.json();
        allShelters.push(...shelters.data);
        hasNext = shelters.page.has_next;
        page++;
      }
      const ownerShelter = allShelters.find(s => s.email === email);
      return ownerShelter;
    }



    fetchAllData();
    // end of useEffect()
  }, []);


  const processPhotos = (photos) => {
    const defaultPhoto = "/images/logo_ref.png";
    if (photos.length == 0) {
      return [defaultPhoto];
    }

    const photoUrls = photos.map((photo) => {
      return `${process.env.REACT_APP_API_URL}/${photo.url}`;
    });
    return photoUrls;
  }



  const mainContent = (listing, shelter) => {
    const fDate = new Date(listing.created_time).toLocaleDateString();
    const allPhotos = processPhotos(listing.photos);
    const isListingOwner = userId == shelter.id;

    const renderActionBtn = () => {
      if (isListingOwner) {
        // return edit button
        return (
          <Button handleClick={() => { navigate(`/petlistings/${petId}/edit`) }}>Edit pet</Button>
        )
      }

      const shelterContact = `/messages/${shelter.id}`
      if (role === "seeker") {
        if (listing.status !== "AV") {
          return (
            // contact shelter btn
            <Button classes="square-btn" id="contact-shelter-btn" handleClick={() => { navigate(shelterContact) }}>contact shelter</Button>
          )
        }
  
        return (
          // returning:
          // contact shelter btn
          // application form btn
          <>
            <Button classes="square-btn" id="contact-shelter-btn" handleClick={() => { navigate(shelterContact) }}>contact shelter</Button>
            <Button id="application-form-btn" handleClick={() => { navigate(`/applications`) }}>Application Form</Button>
          </>
        )
      } else {
        return <></>
      }

    }

    return (
      <div className="main__wrapper">
        <div className="details-container">
          <Button handleClick={() => { navigate(`/petlistings`) }} btnId="back-btn">view all listings</Button>
          <div className="details-item pet-details-card">
            <div className="pet-profile-container">
              <div className="pet-profile-photos">
                <div className="photo main-photo">
                  <img src={allPhotos[selectedPhoto]} alt=""></img>
                </div>
                <div className="photo-row">
                  {allPhotos.map((photo, i) => (
                    <button key={i} onClick={() => { setSelectedPhoto(i) }}
                      className={`photo small-photo ${selectedPhoto === i ? 'selected' : ''}`}
                    ><img src={allPhotos[i]} alt=""></img></button>
                  ))}
                </div>
              </div>
              <div className="pet-profile-details">
                <div className="pet-profile-header view-mode">
                  <div className="title">{listing.name}</div>
                  <div className="address">{shelter.address}</div>
                </div>
                <div className="pet-profile-info">
                  <div className="row">
                    <div className="key">Shelter:</div>
                    <div className="value">{shelter.email}</div>
                  </div>
                  <div className="row">
                    <div className="key">Size:</div>
                    <div className="value">{sizeMap[listing.size]}</div>
                  </div>
                  <div className="row">
                    <div className="key">Breed:</div>
                    <div className="value">{breedMap(listing.breed)}</div>
                  </div>
                  <div className="row">
                    <div className="key">Age:</div>
                    <div className="value">{listing.age}</div>
                  </div>
                  <div className="row">
                    <div className="key">Sex:</div>
                    <div className="value">{sexMap[listing.gender]}</div>
                  </div>
                  <div className="row">
                    <div className="key">Status:</div>
                    <div id="pet-status" className="value">{statusMap[listing.status]}</div>
                  </div>
                  <div className="row">
                    <div className="key">Category:</div>
                    <div id="category" className="value">{listing.category}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="details-item pet-details-card">
            <div className="description-header">
              <div className="title">Description</div>
              <div className="date">Published: {fDate}</div>
            </div>
            <div className="description-content">
              {listing.description}
            </div>
          </div>

          <div className="details-item btn-container">
            {renderActionBtn()}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (<> <p>loading...</p> </>);
  } else if (err) {
    return (<> <p>{err}</p></>);
  } else {
    return (mainContent(listingData, shelterData));
  }
  // end of PetDetail()
}

export default PetDetail