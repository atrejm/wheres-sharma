import { ProgressBar } from "react-bootstrap"
import { Climb } from "./Game";
import { GameMode, GameStatus } from "../App";

interface Props {
    currentClimb: Climb | null,
    gameStatus: GameStatus,
}

export default function GameUI({currentClimb, gameStatus} :Props) {

    console.log(gameStatus.areasSelected);
    return(
        <>
            <div className="container" data-bs-theme="dark">
                {gameStatus.mode === GameMode.Running ?
                <>
                    <div className="container">
                        <div className="btn-group">
                            {gameStatus.areasSelected.map((area)=> (
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
                        <ProgressBar now={100 - gameStatus.roundsRemaining/5*100}/>
                    </div>
                </>
                :
                <div>
                    <h1>Game Over!</h1>
                    <ProgressBar now={100 - gameStatus.roundsRemaining/5*100}/>
                </div>
                }
                <div className="container">
                    <h3>Score: {gameStatus.score} </h3>
                </div>
            </div>
        </>
    )
}