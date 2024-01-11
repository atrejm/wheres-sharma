import { ProgressBar } from "react-bootstrap"
import { Climb } from "./Game";
import { GameMode, GameStatus } from "../App";

interface Props {
    currentClimb: Climb | null,
    gameStatus: GameStatus,
    handleCenterMap: ({lat, lng}: {lat:number, lng:number}) => void,
}

export default function GameUI({currentClimb, gameStatus, handleCenterMap} :Props) {

    const handleClickToPanMap: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        const areaID = e.currentTarget.value;
        const areaIndex = gameStatus.areasSelected.findIndex((area) => area._id === areaID);

        console.log(`AreaID: ${areaID}, Index: ${areaIndex}`);
        handleCenterMap({lat:gameStatus.areasSelected[areaIndex].lat, 
                         lng:gameStatus.areasSelected[areaIndex].lng});
        console.log(gameStatus.areasSelected[areaIndex]);
    }

    console.log(gameStatus.areasSelected);
    return(
        <>
            <div className="container" data-bs-theme="dark">
                {gameStatus.mode === GameMode.Running ?
                <>
                    <div className="container">
                        <h4 className="display">Jump to: </h4>
                        <div className="btn-group">
                            {gameStatus.areasSelected.map((area)=> (
                                <button 
                                    className="btn btn-outline-secondary active" 
                                    id={"area"+area._id+"-button"} 
                                    value={area._id}
                                    onClick={handleClickToPanMap}>
                                        {area.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="container">
                        <h1>Where is {currentClimb? currentClimb.name : ""}? Hint: {currentClimb? <>{currentClimb.zone}</> : ""}</h1>
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