import { ProgressBar } from "react-bootstrap"

export default function GameUI({currentClimb, score, gameStatus}) {

    return(
        <>
            <div className="container" data-bs-theme="dark">
                {gameStatus.isActive?
                <div className="container">
                    <h1>Where is {currentClimb? currentClimb.name : ""}? Hint: {currentClimb? currentClimb.zone : ""}</h1>
                    <ProgressBar now={100 - gameStatus.roundsLeft/5*100}/>
                </div>
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