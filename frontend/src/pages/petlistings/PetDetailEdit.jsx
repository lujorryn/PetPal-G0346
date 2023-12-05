import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

import '../../styles/reset.css';
import '../../styles/global.css';
import './PetDetail.css';

import Button from '../../components/ui/Button';



function PetDetailEdit() {
  const { token, userId, role } = useAuth();
  const [listingData, setListingData] = useState([]);
  const [initialListing, setInitialListingData] = useState({});
  const [shelterData, setShelterData] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [photoUrls, setPhotoUrls] = useState([]);


  const { petId } = useParams();
  const navigate = useNavigate();

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
        const allPhotos = processPhotos(petlisting.photos);
        setPhotoUrls(allPhotos);

        const listingOwner = await getListingOwner(petlisting.owner);
        setShelterData(listingOwner);
        setInitialListingData(petlisting);

        console.log("first init", initialListing)
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

    if (Array.isArray(photos)) {
      const photoUrls = photos.map((photo) => {
        return `${process.env.REACT_APP_API_URL}/${photo.url}`;
      });
      return photoUrls;
    }
    return [defaultPhoto];
  }

  const stringToCode = (key) => {
    let string = listingData[key];
    switch (key) {
      case 'age':
        return parseInt(string)

      case 'gender':
        string = string.toLowerCase()
        if (['male', 'm'].includes(string)) {
          return 'M'
        }
        if (['female', 'f'].includes(string)) {
          return 'F'
        }
        if (['unknown', 'other', 'x'].includes(string)) {
          return 'X'
        }
        return 'X'

      case 'size':
        string = string.toLowerCase()
        if (['large', 'l'].includes(string)) {
          return 'L'
        }
        if (['medium', 'm'].includes(string)) {
          return 'M'
        }
        if (['small', 's'].includes(string)) {
          return 'S'
        }
        return 'S'

      case 'status':
        string = string.toLowerCase();
        if (['pending', 'pe'].includes(string)) {
          return 'PE'
        }
        if (['available', 'av'].includes(string)) {
          return 'AV'
        }
        if (['withdrawn', 'wi'].includes(string)) {
          return 'WI'
        }
        if (['adopted', 'ad'].includes(string)) {
          return 'AD'
        }
        return 'PE'

      default:
        return string;

    } // end of switch(key)

  } // end of string to code()


  const mainContent = (listing, shelter) => {
    console.log(listing)
    const fDate = new Date(listing.created_time).toLocaleDateString();
    
    const isListingOwner = userId == shelter.id;
    
    const sendPut = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      for (const key in listingData) {
        if (listingData.hasOwnProperty(key)) {
          formData.append(key, stringToCode(key));
        }
      }


      try {
        const response = await fetch(listingUrl, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': "application/json",
          },
          body: formData,
        });
        if (!response.ok) {
          console.log(response)
          const sd = await response.json();
          console.log(sd);
          console.error('File upload failed:', response.error);
        } else {
          console.log('File uploaded successfully.');
        }
      } catch (error) {
        console.error('Error during file upload:', error.message);
      }
      navigate(`/petlistings/${petId}`)
    } // end of sendput()

    const renderActionBtn = () => {
      if (isListingOwner) {
        // return save button
        return (
          <Button handleClick={sendPut}>Save</Button>
        )
      }

      const shelterContact = `/messages/${shelter.id}`
      if (listing.status !== "AV") {
        // contact shelter btn
        return (
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
    }

    const handlePetChange = async (event) => {
      let { name, value } = event.target;
      listingData[name] = value;
      setListingData({ ...listingData });
    }

    const handleShelterChange = (event) => {
      const { name, value } = event.target;
      setShelterData({ ...shelterData, [name]: value });
    }

    const handleFileChange = async (event) => {
      const kfile = event.target.files[0];
      if (!kfile) {
        return;
      }
      
      const formData = new FormData();
      for (const key in listingData) {
        if (listingData.hasOwnProperty(key)) {
          formData.append(key, listingData[key]);
        }
      }
      
      formData.append("photos", kfile);
      try {
        const response = await fetch(listingUrl, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': "application/json",
          },
          body: formData,
        });
        if (!response.ok) {
          console.log(response)
          const sd = await response.json();
          console.log(sd);
          console.error('File upload failed:', response.error);
        } else {
          console.log('File uploaded successfully.');
        }
      } catch (error) {
        console.error('Error during file upload:', error.message);
      }

      const objectUrl = URL.createObjectURL(kfile);
      setPhotoUrls([...photoUrls, objectUrl])
      setSelectedPhoto(photoUrls.length)
    }

    return (
      <form className="main__wrapper">
        <div className="details-container">
          <Button handleClick={() => { navigate(`/petlistings/${petId}`) }} btnId="back-btn">back to listing</Button>
          <div className="details-item pet-details-card">
            <div className="pet-profile-container">
              <div className="pet-profile-photos">
                <div className="photo main-photo">
                  <img src={photoUrls[selectedPhoto]} alt=""></img>
                </div>
                <div className="photo-row">
                  {photoUrls.map((photo, i) => (
                    <button key={i} onClick={() => {console.log(`${i} clicked`); setSelectedPhoto(i) }}
                      className={`photo small-photo ${selectedPhoto === i ? 'selected' : ''}`}
                    ><img src={photoUrls[i]} alt=""></img></button>
                  ))}
                  {/* upload new photo */}
                  <label htmlFor="add-photo" className="photo small-photo add-photo">
                    <input id="add-photo" type="file" style={{ display: 'none' }} name='photos' onChange={handleFileChange} />
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '30px', height: '30px' }} viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"></path>
                    </svg>
                  </label>
                </div>
              </div>

              <div className="pet-profile-details edit-mode">
                <div className="pet-profile-header edit-mode">
                  <input className="title" name="name" value={listing.name} onChange={handlePetChange} placeholder="pet name" required />
                  <input id="address" className="address" name="address" value={shelter.address} onChange={handleShelterChange} placeholder='shelter address' />
                </div>
                <div className="pet-profile-info">
                  <div className="row">
                    <label htmlFor="shelter" className="key">Shelter:</label>
                    <input name="email" className="value" value={shelter.email} onChange={handleShelterChange} placeholder='shelter email' />
                  </div>
                  <div className="row">
                    <label htmlFor="size" className="key">Size:</label>
                    <input className="value" name="size" value={listing.size} onChange={handlePetChange} />
                  </div>
                  <div className="row">
                    <label htmlFor="breed" className="key">Breed:</label>
                    <input className="value" name="breed" value={listing.breed} onChange={handlePetChange} />
                  </div>
                  <div className="row">
                    <label htmlFor="age" className="key">Age:</label>
                    <input type='number' className="value" name="age" value={listing.age} onChange={handlePetChange} />
                  </div>
                  <div className="row">
                    <label htmlFor="gender" className="key">Sex:</label>
                    <input name="gender" className="value" value={listing.gender} onChange={handlePetChange} />
                  </div>
                  <div className="row">
                    <label htmlFor="pet-status" className="key">Status:</label>
                    <input id="pet-status" className="value" name="status" value={listing.status} onChange={handlePetChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="details-item pet-details-card">
            <label htmlFor="pet-description" className="description-header">
              <div className="title">Description</div>
              <div className="date">Published: {fDate}</div>
            </label>
            <textarea value={listing.description} required id="pet-description" name="description" className="description-content" onChange={handlePetChange}>
              
            </textarea>
          </div>

          <div className="details-item btn-container">
            {renderActionBtn()}
          </div>
        </div>
      </form>
    );
    // end of mainContent()
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

export default PetDetailEdit