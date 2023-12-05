import { useState } from "react";

function TextInput ({label_for, field_name, readOnly, value, type='text'}) {

    const [inputValue, setInputValue] = useState(value); 
    
    // Input change handler
    const handleInputChange = (e) => {
        // Update the state with the entered value
        setInputValue(e.target.value);
  };

    return (
        <span className="input-container">
            <label htmlFor={label_for}> {field_name} </label>
            <span>
                <input type={type} name={label_for} id={label_for} readOnly={readOnly} value={inputValue} onChange={handleInputChange} required/>
            </span>
        </span>
      )
}

export default TextInput;