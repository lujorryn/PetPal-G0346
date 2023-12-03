import './style.css';
import Button from '../../ui/Button/index.jsx'

// Component for an application or message row 

function CorrespondenceRow ({subject, from, preview, timestamp, handleClick}) {
    return (
        <div class="msg-row"> 
            <div class="msg-info">
                <div class="msg-subject"> Application from {subject} </div>
                <div class="msg-from"> From: {from} </div>
                <div class="msg-preview"> {preview} </div>
                <div class="msg-time"> {timestamp} </div>
            </div>
            <div class="btn-container">
                <Button classes={"btn"} children={"View"} handleClick={handleClick}/>
            </div>
        </div>
    ); 
}

export default CorrespondenceRow;