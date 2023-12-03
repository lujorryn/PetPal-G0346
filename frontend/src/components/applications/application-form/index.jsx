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
                        <label for="first-name"> First Name: </label>
                        <span>
                            <input type='text' name='first-name' id='first-name' readonly={readOnly} value={data.firstName} required/>
                        </span>
                    </div>
                    {/* Last name field */}
                    <div className='full-input group-5'>
                        <label for='last-name'> Last Name: </label>
                        <span>
                            <input type='text' name='last-name' id='last-name' readonly={readOnly} value={data.lastName} required/>
                        </span>
                    </div>
                </div>
                {/* Row for address */}
                <div className='form-row'>
                    <div className='full-input'>
                        <label for='address'> Address: </label>
                        <span>
                            <input type='text' name='address' id='address' readonly={readOnly} value={data.address} required/>
                        </span>
                    </div>
                </div>
                {/* Row for City, Province, and Postal Code */}
                <div className='form-row'>
                    <div className='full-input group-4'>
                        <label for='city'> City: </label>
                        <span>
                            <input type='text' name='city' id='city' readonly={readOnly} value={data.city} required/>
                        </span>
                    </div>
                    <div className='full-input group-2'>
                        <label for="province">Province:</label>
                        <span>
                            <input type="text" name="province" id="province" readonly={readOnly} value={data.province} required/>
                        </span>
                    </div>
                    <div className='full-input group-4'>
                        <label for="postal-code">Postal Code:</label>
                        <span>
                            <input type="text" name="postal-code" id="postal-code" readonly={readOnly} value={data.postalCode} required/> 
                        </span>
                    </div>
                </div>
                {/* Row for phone number */}
                <div class="form-row">
                    <div class="full-input group-5">
                        <label for="phone">Phone Number:</label>
                        <span>
                            <input type="tel" name="phone" id="phone" required readonly={readOnly} value={data.phoneNum} /> 
                        </span>
                    </div>
                </div>
                {/* <!-- email --> */}
                <div class="form-row">
                    <div class="full-input group-5">
                        <label for="user-email">Email:</label>
                        <span>
                            <input type="email" name="user-email" id="user-email" readonly={readOnly} require value={data.email}/> 
                        </span>
                    </div>
                </div>
                {/* <!-- contact preference --> */}
                <div class="form-group">
                    <label for="contact-preference">How do you prefer to be contacted?</label>
                    <div class="form-row radio-group">
                        <div> 
                            <input type="radio" id="phone-call" name="contact-preference" value="phone-call" disabled={is_disabled} checked={data.pref_call}/> 
                            <label for="phone-call">Phone Call</label>
                        </div>
                        <div>
                            <input type="radio" id="text" name="contact-preference" value="text" disabled={is_disabled} checked={data.pref_text}/> 
                            <label for="text">Text</label>
                        </div>
                        <div>
                            <input type="radio" id="email" name="contact-preference" value="email" disabled={is_disabled} checked={data.pref_email}/> 
                            <label for="email">Email</label>
                        </div>
                    </div>
                </div>
                {/* <!-- number of pets --> */}
                <div class="form-row">
                    <label for="number-of-pets">Number of pets in the household:</label>
                    <input type="number" id="number-of-pets" name="number-of-pets" min="0" required readonly={readOnly} value={data.pet_num}/> 
                </div>
                {/* <!-- children --> */}
                <div class="form-row">
                    <label>Do you have any children at home?</label>
                    <div>
                        <input type="radio" id="yes" name="children" value="yes" required disabled={is_disabled} checked={data.has_children}/>
                        <label for="yes">Yes</label>
                        <input type="radio" id="no" name="children" value="no" required disabled={is_disabled} checked={!data.has_children}/> 
                        <label for="no">No</label>
                    </div>
                </div>
                    {/* <!-- pet experience level --> */}
                    <div class="form-group">
                    <label for="pet-experience">Choose which one best describes your experience with pets:</label>
                    <div class="form-row radio-group">
                        <div>
                            <input type="radio" id="experienced" name="pet-experience" value="experienced" required disabled={is_disabled} checked={data.experienced}/>
                            <label for="experienced">Experienced</label>
                        </div>
                        <div>
                            <input type="radio" id="intermediate" name="pet-experience" value="intermediate" disabled={is_disabled} checked={data.intermediate}/>
                            <label for="intermediate">Intermediate</label>
                        </div>
                        <div>
                            <input type="radio" id="no-experience" name="pet-experience" value="no-experience" disabled={is_disabled} checked={data.no_exp}/>
                            <label for="no-experience">No Experience</label>
                        </div>
                    </div>
                </div>
                {/* <!-- housing type --> */}
                <div class="form-group">
                    <label for="pet-experience">What type of residence do you currently live in?</label>
                    <div class="form-row radio-group">
                        <div>
                            <input type="radio" id="condo" name="housing-type" value="Condo" required disabled={is_disabled} checked={data.condo}></input>
                            <label for="condo">Condo</label>
                        </div>
                        <div>
                            <input type="radio" id="apartment" name="housing-type" value="Apartment" disabled={is_disabled} checked={data.apt}></input>
                            <label for="apartment">Apartment</label>
                        </div>
                        <div>
                            <input type="radio" id="house" name="housing-type" value="House" disabled={is_disabled} checked={data.house}></input>
                            <label for="house">House</label>
                        </div>
                    </div>
                </div>
                
            </div>

            <div class="btn-row">
                {/* <input id="submit-btn" class="btn" type="submit" value="Submit" /> */}
                <Button classes={"btn"} children={button_text} handleClick={handleClick}/>
            </div>
        </form>

    );
}

export default ApplicationForm;