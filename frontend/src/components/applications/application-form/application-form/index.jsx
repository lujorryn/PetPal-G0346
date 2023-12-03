import './style.css';
import Button from '../../ui/Button/index.jsx'

// Component for the application form 

function ApplicationForm({readOnly, is_disabled, data, button_text, handleClick}) {
    return (
        <form className='form-container' aria-readonly={readOnly} required> 
            <div className='form-content'>
                <div className='title'> My Application </div>
                {/* Row for first and last names */}
                <div className='form-row'> 
                    {/* First name field */}
                    <div className='full-input group-5'>
                        <label htmlFor="first-name"> First Name: </label>
                        <span>
                            <input type='text' name='first-name' id='first-name' readOnly={readOnly} value={data.firstName} required/>
                        </span>
                    </div>
                    {/* Last name field */}
                    <div className='full-input group-5'>
                        <label htmlFor='last-name'> Last Name: </label>
                        <span>
                            <input type='text' name='last-name' id='last-name' readOnly={readOnly} value={data.lastName} required/>
                        </span>
                    </div>
                </div>
                {/* Row for address */}
                <div className='form-row'>
                    <div className='full-input'>
                        <label htmlFor='address'> Address: </label>
                        <span>
                            <input type='text' name='address' id='address' readOnly={readOnly} value={data.address} required/>
                        </span>
                    </div>
                </div>
                {/* Row for City, Province, and Postal Code */}
                <div className='form-row'>
                    <div className='full-input group-4'>
                        <label htmlFor='city'> City: </label>
                        <span>
                            <input type='text' name='city' id='city' readOnly={readOnly} value={data.city} required/>
                        </span>
                    </div>
                    <div className='full-input group-2'>
                        <label htmlFor="province">Province:</label>
                        <span>
                            <input type="text" name="province" id="province" readOnly={readOnly} value={data.province} required/>
                        </span>
                    </div>
                    <div className='full-input group-4'>
                        <label htmlFor="postal-code">Postal Code:</label>
                        <span>
                            <input type="text" name="postal-code" id="postal-code" readOnly={readOnly} value={data.postalCode} required/> 
                        </span>
                    </div>
                </div>
                {/* Row for phone number */}
                <div className="form-row">
                    <div className="full-input group-5">
                        <label htmlFor="phone">Phone Number:</label>
                        <span>
                            <input type="tel" name="phone" id="phone" required readOnly={readOnly} value={data.phoneNum} /> 
                        </span>
                    </div>
                </div>
                {/* <!-- email --> */}
                <div className="form-row">
                    <div className="full-input group-5">
                        <label htmlFor="user-email">Email:</label>
                        <span>
                            <input type="email" name="user-email" id="user-email" readOnly={readOnly} required value={data.email}/> 
                        </span>
                    </div>
                </div>
                {/* <!-- contact preference --> */}
                <div className="form-group">
                    <label htmlFor="contact-preference">How do you prefer to be contacted?</label>
                    <div className="form-row radio-group">
                        <div> 
                            <input type="radio" id="phone-call" name="contact-preference" value="phone-call" disabled={is_disabled} checked={data.pref_call}/> 
                            <label htmlFor="phone-call">Phone Call</label>
                        </div>
                        <div>
                            <input type="radio" id="text" name="contact-preference" value="text" disabled={is_disabled} checked={data.pref_text}/> 
                            <label htmlFor="text">Text</label>
                        </div>
                        <div>
                            <input type="radio" id="email" name="contact-preference" value="email" disabled={is_disabled} checked={data.pref_email}/> 
                            <label htmlFor="email">Email</label>
                        </div>
                    </div>
                </div>
                {/* <!-- number of pets --> */}
                <div className="form-row">
                    <label htmlFor="number-of-pets">Number of pets in the household:</label>
                    <input type="number" id="number-of-pets" name="number-of-pets" min="0" required readOnly={readOnly} value={data.pet_num}/> 
                </div>
                {/* <!-- children --> */}
                <div className="form-row">
                    <label>Do you have any children at home?</label>
                    <div>
                        <input type="radio" id="yes" name="children" value="yes" required disabled={is_disabled} checked={data.has_children}/>
                        <label htmlFor="yes">Yes</label>
                        <input type="radio" id="no" name="children" value="no" required disabled={is_disabled} checked={!data.has_children}/> 
                        <label htmlFor="no">No</label>
                    </div>
                </div>
                    {/* <!-- pet experience level --> */}
                    <div className="form-group">
                    <label htmlFor="pet-experience">Choose which one best describes your experience with pets:</label>
                    <div className="form-row radio-group">
                        <div>
                            <input type="radio" id="experienced" name="pet-experience" value="experienced" required disabled={is_disabled} checked={data.experienced}/>
                            <label htmlFor="experienced">Experienced</label>
                        </div>
                        <div>
                            <input type="radio" id="intermediate" name="pet-experience" value="intermediate" disabled={is_disabled} checked={data.intermediate}/>
                            <label htmlFor="intermediate">Intermediate</label>
                        </div>
                        <div>
                            <input type="radio" id="no-experience" name="pet-experience" value="no-experience" disabled={is_disabled} checked={data.no_exp}/>
                            <label htmlFor="no-experience">No Experience</label>
                        </div>
                    </div>
                </div>
                {/* <!-- housing type --> */}
                <div className="form-group">
                    <label htmlFor="pet-experience">What type of residence do you currently live in?</label>
                    <div className="form-row radio-group">
                        <div>
                            <input type="radio" id="condo" name="housing-type" value="Condo" required disabled={is_disabled} checked={data.condo}></input>
                            <label htmlFor="condo">Condo</label>
                        </div>
                        <div>
                            <input type="radio" id="apartment" name="housing-type" value="Apartment" disabled={is_disabled} checked={data.apt}></input>
                            <label htmlFor="apartment">Apartment</label>
                        </div>
                        <div>
                            <input type="radio" id="house" name="housing-type" value="House" disabled={is_disabled} checked={data.house}></input>
                            <label htmlFor="house">House</label>
                        </div>
                    </div>
                </div>
                
            </div>

            <div className="btn-row">
                {/* <input id="submit-btn" className="btn" type="submit" value="Submit" /> */}
                <Button classes={"btn"} children={button_text} handleClick={handleClick}/>
            </div>
        </form>

    );
}

export default ApplicationForm;