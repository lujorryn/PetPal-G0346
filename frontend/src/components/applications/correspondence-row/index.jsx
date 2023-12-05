import './style.css';
import Button from '../../ui/Button/index.jsx'

// Component for an application or message row 

function CorrespondenceRow ({subject, from, preview, timestamp, handleViewBtn, is_app=false, is_seeker=true, 
                            handleWDBtn, handleAcceptBtn=null, isHidden}) {
    // Do not render if the row is meant to be hidden. 
    if (isHidden) {
        return null;
        }
    
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
                /* This if 'switch' is true */
                <div className="btn-container">
                    <Button classes={"btn"} children={"View"} handleClick={handleViewBtn}/>
                    <br></br>
                    {!is_seeker ? (
                    <Button classes={"btn withdraw-btn"} children={"Withdraw App"} handleClick={handleWDBtn}/>
                    ) : (
                    <>
                        <Button classes={"btn accept-btn"} children={"Accept App"} handleClick={handleAcceptBtn}/>
                        <br></br>
                        <Button classes={"btn withdraw-btn"} children={"Deny App"} handleClick={handleWDBtn}/>
                    </>
                    )}
                </div>
                ) : (
                /* else this */
                <div className="btn-container">
                    <Button classes={"btn"} children={"View"} handleClick={handleViewBtn}/>
                </div>
                )}

            </div>
        </div>
    ); 
}

export default CorrespondenceRow;