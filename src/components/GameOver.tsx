import { Dispatch, SetStateAction } from "react";
import { GameMode, GameStatus } from "../App";

interface Props {
    gameStatus: GameStatus,
    setGameStatus: Dispatch<SetStateAction<GameStatus>>
}

export default function GameOver({gameStatus, setGameStatus} :Props) {

    const handleRestart = () => {
        setGameStatus({
            mode: GameMode.Initialization,
            areasSelected: [],
            score: 0,
            roundsRemaining: 5
        })
    }

    return(
        <>
            <h1>Game over</h1>
            <h2>Score: {gameStatus.score}</h2>
            <button className="btn btn-success btn-lg" onClick={handleRestart}>Restart Game</button>
        </>
    )
}