import './style.css';
import Button from '../../ui/Button/index.jsx'

// Component for an application or message row 

function CorrespondenceRow ({subject, from, preview, timestamp, handleViewBtn, is_app=false, is_seeker=true, 
                            handleWDBtn, handleAcceptBtn=null}) {
    return (
        <div class="msg-row"> 
            <div class="msg-info">
                {is_app ? (
                    <span>
                        <div class="msg-subject"> {subject}'s Pet Application </div>
                    </span>
                    ) : (
                    <span> 
                        <div class="msg-subject"> Message from {subject} </div>
                        <div class="msg-from"> From: {from} </div>
                    </span>
                    )
                }
                <div class="msg-preview"> {preview} </div>
                <div class="msg-time"> {timestamp} </div>
            </div>
            <div class="btn-container">
                {is_app ? (
                    <div className="btn-container">
                        <Button classes={"btn"} children={"View"} handleClick={handleViewBtn}/>
                        <br></br>
                        <Button classes={"btn withdraw-btn"} children={"Withdraw App"} handleClick={handleWDBtn}/>
                    </div>
                ) : (
                    <div className='btn-container'>
                        <Button classes={"btn"} children={"View"} handleClick={handleViewBtn}/>
                    </div>
                    )
                }
            </div>
        </div>
    ); 
}

export default CorrespondenceRow;