import './style.css';


// Button component to toggle between created time or last updated 
function ApplicationSort ({ setSortCreatedTime, sortCreatedTime }) {
    
    const handleClick = () => {
        setSortCreatedTime(!sortCreatedTime);
    }

    return (
        <div> 
            <i><button onClick={handleClick} className="app-sort-btn">
                    <u>{sortCreatedTime ? 'Sort by Created Time' : 'Sort by Last Updated'}</u>
                </button>
            </i>
        </div>
    )
}
 export default ApplicationSort;