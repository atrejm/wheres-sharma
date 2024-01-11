import { useEffect, useState } from "react"
import { requestHighScores } from "../helpers/sendRequest";
import { GameStatus } from "../App";

interface Score {
    score: number;
    username: string;
}

export default function HighScorePanel({gameStatus} : {gameStatus:GameStatus}) {
    const [highScores, setHighScores] = useState<Array<Score>>([]);

    useEffect(()=> {
        const getScores = async () => {
            const url = sessionStorage.getItem("apiURL")+"";
            const scores = await requestHighScores(url);

            const scoresToSet : Array<Score> = [];
            scores.forEach((score) => {
                scoresToSet.push({score: score.highScore, username: score.username});
            })

            setHighScores(scoresToSet);
        }
        getScores();
    }, [gameStatus])

    return(
        <div className="card text-white bg-secondary p-4" style={{height:"100vh"}}>
            <h1 className="display">High Scores</h1>
            <ol>
                {highScores.map((score) => (
                    <li key={score.username}>
                        <div>
                            <h5>{score.username}</h5>
                            <h6>{score.score}</h6>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    )
}