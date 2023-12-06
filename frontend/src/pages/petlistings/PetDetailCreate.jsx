import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

import '../../styles/reset.css';
import '../../styles/global.css';
import './PetDetail.css';

import Button from '../../components/ui/Button';



function PetDetailCreate() {
    const { token, userId, role } = useAuth();
    const [listingData, setListingData] = useState({});
    const sampleListing = {
        name: "",
        category: "",
        breed: "",
        age: "",
        gender: "",
        size: "",
        status: "AV",
        med_history: "none",
        description: "",
        // not provided
    }
    const [shelterData, setShelterData] = useState(sampleListing);
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [photoUrls, setPhotoUrls] = useState([]);
    const [photoObjects, setPhotoObjects] = useState([]);


    const navigate = useNavigate();

    const listingUrl = `${process.env.REACT_APP_API_URL}/api/petlistings`;

    // upon page load: fetch petlisting and shelter
    useEffect(() => {
        setListingData(sampleListing);
        const getReqContent = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': "application/json",
            }
        }

        const fetchAllData = async () => {
            try {
                const listingOwner = await getShelterById(userId);
                setShelterData(listingOwner);
                // console.log(listingOwner);
            } catch (err) {
                setErr(err.message);
                console.log("Uh oh =>", err);
            }

            setLoading(false);
        }

        const getShelterById = async (id) => {
            if (role !== "shelter") {
                throw new Error("you're not not a shelter")
                return;
            }

            let shelterUrl = `${process.env.REACT_APP_API_URL}/api/shelters/${id}`;
            const res = await fetch(shelterUrl, getReqContent);

            if (res.status != 200) {
                throw new Error(res.statusText);
            }

            const shelter = await res.json();
            return shelter.data;
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
        const fDate = new Date(listing.created_time).toLocaleDateString();


        const sendPost = async (e) => {
            e.preventDefault();
            let url = `${process.env.REACT_APP_API_URL}/api/petlistings`;
            let pk = 0;
            let method = 'POST'

            for (let i = 0; i < photoUrls.length; i++) {
                const newFormData = new FormData();
                for (const key in listingData) {
                    if (listingData.hasOwnProperty(key)) {
                        newFormData.append(key, stringToCode(key));
                    }
                }
                if (i < photoObjects.length) {
                    newFormData.append("photos", photoObjects[i]);
                }

                try {
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            Authorization: `Bearer ${token}`,
                            // 'Content-Type': "application/json",
                        },
                        body: newFormData,
                    });
                    if (!response.ok) {
                        // console.log(response)
                        const sd = await response.json();
                        // console.log("json:::", sd);
                        console.error('File upload failed:', response.error);
                    } else {
                        const oj = await response.json();
                        console.log('File uploaded successfully.', oj);
                        pk = oj.data.pk;
                    }
                } catch (error) {
                    console.error('Error during file upload:', error.message);
                }
                method = "PUT"
                url = `${process.env.REACT_APP_API_URL}/api/petlistings/${pk}`;
            } // end of for
            navigate(`/petlistings`)
        } // end of sendPost()

        const renderActionBtn = () => {
            return (
                <Button handleClick={sendPost}>Save</Button>
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

            const objectUrl = URL.createObjectURL(kfile);
            setPhotoUrls([...photoUrls, objectUrl])
            setPhotoObjects([...photoObjects, kfile])
            setSelectedPhoto(photoUrls.length)
            //   console.log("photos", photoUrls)
        }

        return (
            <form className="main__wrapper">
                <div className="details-container">
                    <Button handleClick={() => { navigate(`/petlistings`) }} btnId="back-btn">back to listing</Button>
                    <div className="details-item pet-details-card">
                        <div className="pet-profile-container">
                            <div className="pet-profile-photos">
                                <div className="photo main-photo">
                                    <img src={photoUrls[selectedPhoto]} alt=""></img>
                                </div>
                                <div className="photo-row">
                                    {photoUrls.map((photo, i) => (
                                        <button key={i} onClick={(e) => { setSelectedPhoto(i); e.preventDefault(); }}
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
                                    <input readOnly id="address" className="address" name="address" value={shelter.address} onChange={handleShelterChange} placeholder='shelter address' />
                                </div>
                                <div className="pet-profile-info">
                                    <div className="row">
                                        <label htmlFor="shelter" className="key">Shelter:</label>
                                        <input readOnly name="email" className="value" value={shelter.email} onChange={handleShelterChange} placeholder='shelter email' />
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
                                        <label className="key">Category:</label>
                                        <div className="value form-radio-labels">
                                            <label>
                                                <input
                                                    className='form-radio-input'
                                                    type="radio"
                                                    name="category"
                                                    value="D"
                                                    checked={listing.category === 'D'}
                                                    onChange={handlePetChange}
                                                />
                                                Dog
                                            </label>
                                            <label>
                                                <input
                                                    className='form-radio-input'
                                                    type="radio"
                                                    name="category"
                                                    value="C"
                                                    checked={listing.category === 'C'}
                                                    onChange={handlePetChange}
                                                />
                                                Cat
                                            </label>
                                            <label>
                                                <input
                                                    className='form-radio-input'
                                                    type="radio"
                                                    name="category"
                                                    value="O"
                                                    checked={listing.category === 'O'}
                                                    onChange={handlePetChange}
                                                />
                                                Other
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="details-item pet-details-card">
                        <label htmlFor="pet-description" className="description-header">
                            <div className="title">Description</div>
                            <div className="date">being published today</div>
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

export default PetDetailCreate