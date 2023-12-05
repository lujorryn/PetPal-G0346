import { useState } from "react";

// label_for is for both id and htmlFor 
function RadioInput ({label_for, field_name, name, is_disabled, is_checked}) {

    const [isChecked, setIsChecked] = useState(is_checked); 
    
    // Radio input change handler
    const handleInputChange = () => {
        setIsChecked(!isChecked); // Toggle the checked state
    };

    if (name === "children") {
        return (
            <span> 
                <input type="radio" id={label_for} name={name} value={label_for} disabled={is_disabled} checked={isChecked} onChange={handleInputChange}/> 
                <label htmlFor={label_for}>{field_name}</label>
            </span>
          )
    }

    return (
        <div> 
            <input type="radio" id={label_for} name={name} value={label_for} disabled={is_disabled} checked={isChecked} onChange={handleInputChange}/> 
            <label htmlFor={label_for}>{field_name}</label>
        </div>
      )
}

export default RadioInput;