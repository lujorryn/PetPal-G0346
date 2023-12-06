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
        <div className="msg-row"> 
            <div className="msg-info">
                {is_app ? (
                    <span>
                        <div className="msg-subject"> {subject}'s Pet Application </div>
                    </span>
                    ) : (
                    <span> 
                        <div className="msg-subject"> Message from {subject} </div>
                        <div className="msg-from"> From: {from} </div>
                    </span>
                    )
                }
                <div className="msg-preview"> {preview} </div>
                <div className="msg-time"> {timestamp} </div>
            </div>
            <div className="btn-container">
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