import { Dispatch, SetStateAction } from "react"
import { GameMode, GameStatus } from "../App"
import { Area } from "./Game"

interface Props {
    gameStatus: GameStatus,
    setGameStatus: Dispatch<SetStateAction<GameStatus>>
}

export default function Menu({gameStatus, setGameStatus}: Props) {
    // Menu to show up on initial launch
    // landing page to select areas and explain game


    // get all available areas

    // let player select which areas are included in game

    // player initiates game start

    const handleGameStart = () => {
        console.log("Starting Game");
        setGameStatus({
            mode: GameMode.Running,
            areasSelected: gameStatus.areasSelected,
            roundsRemaining: gameStatus.roundsRemaining,
            score: gameStatus.score
        });
    }

    return(
        <>
            <div className="container">
                <div className="jumbotron">
                    <h1 className="display-4">Menu</h1>
                    <div className="button-group">   
                    </div>
                    <hr className="my-4"></hr>
                    <button className="btn btn-primary btn-lg" onClick={handleGameStart}>Start Game</button>
                </div>
            </div>
        </>
    )
}