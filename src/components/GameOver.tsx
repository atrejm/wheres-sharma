import { Dispatch, SetStateAction, useEffect } from "react";
import { GameMode, GameStatus } from "../App";
import { uploadLatestGameScore } from "../helpers/sendRequest";

interface Props {
    gameStatus: GameStatus,
    setGameStatus: Dispatch<SetStateAction<GameStatus>>
}

export default function GameOver({gameStatus, setGameStatus} :Props) {

    useEffect(() => {
        //Once when this screen renders
        const upload = async () => {
            const url = sessionStorage.getItem("apiURL")
            if (url)
                await uploadLatestGameScore(gameStatus.score, url, []); // this should eventually send the game history
        }
        
        upload();
    }, []);

    const handleRestart = () => {
        setGameStatus({
            mode: GameMode.Initialization,
            areasSelected: [],
            climbs: [],
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