import './style.css';
import Button from '../../ui/Button/index.jsx'
import TextInput from '../application-input/text-input.jsx'
import RadioInput from '../application-input/radio-input.jsx'

// Component for the application form 

function ApplicationForm({readOnly, is_disabled, data, button_text, handleClick, on_submit="", error=""}) {
    return (
        <form className='form-container' aria-readonly={readOnly} onSubmit={on_submit} required> 
            <div className='form-content'>
                <div className='title'> My Application </div>
                <div id='error-message'> <i>{error}</i></div>
                {/* Row for first and last names */}
                <div className='form-row'> 
                    {/* First name field */}
                    <div className='full-input group-5'>
                        <TextInput label_for={'first-name'} field_name={'First Name:'} readOnly={readOnly} value={data.firstName}/>
                    </div>
                    {/* Last name field */}
                    <div className='full-input group-5'>
                        <TextInput label_for={'last-name'} field_name={'Last Name:'} readOnly={readOnly} value={data.lastName}/>
                    </div>
                </div>
                {/* Row for address */}
                <div className='form-row'>
                    <div className='full-input'>
                        <TextInput label_for={'address'} field_name={'Address:'} readOnly={readOnly} value={data.address}/>
                    </div>
                </div>
                {/* Row for City, Province, and Postal Code */}
                <div className='form-row'>
                    <div className='full-input group-4'>
                        <TextInput label_for={'city'} field_name={'City:'} readOnly={readOnly} value={data.city}/>
                    </div>
                    <div className='full-input group-2'>
                        <TextInput label_for={'province'} field_name={'Province:'} readOnly={readOnly} value={data.province}/>
                    </div>
                    <div className='full-input group-4'>
                        <TextInput label_for={'postal-code'} field_name={'Postal Code:'} readOnly={readOnly} value={data.postalCode}/>
                    </div>
                </div>
                {/* Row for phone number */}
                <div className="form-row">
                    <div className="full-input group-5">
                        <TextInput label_for={'phone'} field_name={'Phone Number:'} readOnly={readOnly} value={data.phoneNum} type={"tel"}/>
                    </div>
                </div>
                {/* <!-- email --> */}
                <div className="form-row">
                    <div className="full-input group-5">
                        <TextInput label_for={'user-email'} field_name={'Email:'} readOnly={readOnly} value={data.email} type={"email"}/>
                    </div>
                </div>
                {/* <!-- contact preference --> */}
                <div className="form-group">
                    <label htmlFor="contact-preference">How do you prefer to be contacted?</label>
                    <div className="form-row radio-group">
                        <RadioInput label_for={'phone-call'} field_name={"Phone Call"} name={"contact-preference"} is_disabled={is_disabled} is_checked={data.pref_call}/>
                        <RadioInput label_for={'text'} field_name={"Text"} name={"contact-preference"} is_disabled={is_disabled} is_checked={data.pref_text}/>
                        <RadioInput label_for={'email'} field_name={"Email"} name={"contact-preference"} is_disabled={is_disabled} is_checked={data.pref_email}/>
                    </div>
                </div>
                {/* <!-- number of pets --> */}
                <div className="form-row">
                    <TextInput label_for={"number-of-pets"} field_name={"Number of pets in the household:"} readOnly={readOnly} value={data.pet_num} type={'number'}/>
                </div>
                {/* <!-- children --> */}
                <div className="form-row">
                    <label>Do you have any children at home?</label>
                    <div>
                        <RadioInput label_for={'yes'} field_name={"Yes"} name={"children"} is_disabled={is_disabled} is_checked={data.has_children}/>
                        <RadioInput label_for={'no'} field_name={"No"} name={"children"} is_disabled={is_disabled} is_checked={!data.has_children}/>
                    </div>
                </div>
                    {/* <!-- pet experience level --> */}
                    <div className="form-group">
                    <label htmlFor="pet-experience">Choose which one best describes your experience with pets:</label>
                    <div className="form-row radio-group">
                        <RadioInput label_for={'experienced'} field_name={"Experienced"} name={"pet-experience"} is_disabled={is_disabled} is_checked={data.experienced}/>
                        <RadioInput label_for={'intermediate'} field_name={"Intermediate"} name={"pet-experience"} is_disabled={is_disabled} is_checked={data.intermediate}/>
                        <RadioInput label_for={'no-experience'} field_name={"No Experience"} name={"pet-experience"} is_disabled={is_disabled} is_checked={data.no_exp}/>
                    </div>
                </div>
                {/* <!-- housing type --> */}
                <div className="form-group">
                    <label htmlFor="pet-experience">What type of residence do you currently live in?</label>
                    <div className="form-row radio-group">
                        <RadioInput label_for={'condo'} field_name={"Condo"} name={"housing-type"} is_disabled={is_disabled} is_checked={data.condo}/>
                        <RadioInput label_for={'apartment'} field_name={"Apartment"} name={"housing-type"} is_disabled={is_disabled} is_checked={data.apt}/>
                        <RadioInput label_for={'house'} field_name={"House"} name={"housing-type"} is_disabled={is_disabled} is_checked={data.house}/>
                    </div>
                </div>
            </div>
            <div className="btn-row">
                {/* <input id="submit-btn" className="btn" type="submit" value="Submit" />
                <Button classes={"btn"} children={button_text} handleClick={handleClick}/> */}

                {!is_disabled ? (
                    <span>
                         <input id="submit-app-btn" className="btn" type="submit" value={button_text} disabled={is_disabled} />
                    </span>

                    ) : (
                    <span>
                        <Button classes={"btn"} children={button_text} handleClick={handleClick}/>
                    </span>
                )}
            </div>
        </form>

    );
}

export default ApplicationForm;