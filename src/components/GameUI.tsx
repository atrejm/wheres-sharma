import { ProgressBar } from "react-bootstrap"

export default function GameUI({currentClimb, score, gameStatus, areas}) {

    console.log(areas);
    return(
        <>
            <div className="container" data-bs-theme="dark">
                {gameStatus.isActive?
                <>
                    <div className="container">
                        <div className="btn-group">
                            {areas.map((area)=> (
                                <button 
                                    className={area.selected?"btn btn-outline-secondary active"
                                                            :"btn btn-outline-secondary"} 
                                    id={"area"+area._id+"-button"} 
                                    value={area}>{area.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="container">
                        <h1>Where is {currentClimb? currentClimb.name : ""}? Hint: {currentClimb? currentClimb.zone : ""}</h1>
                        <ProgressBar now={100 - gameStatus.roundsLeft/5*100}/>
                    </div>
                </>
                :
                <div>
                    <h1>Game Over!</h1>
                    <ProgressBar now={100 - gameStatus.roundsLeft/5*100}/>
                </div>
                }
                <div className="container">
                    <h3>Score: {score} </h3>
                </div>
            </div>
        </>
    )
}