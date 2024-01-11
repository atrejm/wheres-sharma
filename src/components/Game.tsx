import { Dispatch, SetStateAction, useEffect, useState } from "react"
import MapComponent from "./Map";
import GameUI from "./GameUI";
import _ from 'lodash';
import calculateScore from "../helpers/calculateScore";
import { GameMode, GameStatus } from "../App";
import { GoogleMap } from "@react-google-maps/api";

export type Climb = {
    _id: string,
    name: string,
    zone: Area,
    grade: string,
    lat: number,
    lng: number
}

export type Area = {
    _id: string,
    name: string,
    selected: boolean,
    lat: number,
    lng: number,
}

interface Props {
    gameStatus: GameStatus,
    setGameStatus: Dispatch<SetStateAction<GameStatus>>
}

export default function Game({gameStatus, setGameStatus} :Props) {
    const [currentClimb, setCurrentClimb] = useState<Climb | null>(null);
    const [lastClimb, setLastClimb] = useState<Climb | null>(null);
    const [map, setMap] = useState<GoogleMap | null>(null);
    const [totalRounds, setTotalRounds] = useState<number>(0);

    // called once when initialized
    useEffect(() => {
        setTotalRounds(gameStatus.roundsRemaining);
    }, [])

    useEffect(()=> {
        if(gameStatus.climbs.length === 0) { return; }

        const climb = gameStatus.climbs[_.random(0,gameStatus.climbs.length-1)]
        setCurrentClimb(climb);
    }, [gameStatus])

    const updateScoreAndRemoveClimbFromChoices = (score: number) => {
        const index = gameStatus.climbs.findIndex((element) => element == currentClimb)
        const updatedClimbs = gameStatus.climbs
        updatedClimbs.splice(index, 1);
        setGameStatus({
            mode: gameStatus.mode,
            areasSelected: gameStatus.areasSelected,
            climbs: updatedClimbs,
            roundsRemaining: gameStatus.roundsRemaining - 1,
            score: gameStatus.score + score,
        })
        //setGameStatus({roundsLeft:gameStatus.roundsLeft-1, isActive:gameStatus.isActive})
    }

    const handleGuess = (choiceResponse: {correct_climb: Climb, distance: number}) => {
        const last :Climb = choiceResponse.correct_climb;
        const score: number = calculateScore(choiceResponse.distance, gameStatus.areasSelected.length);
        setLastClimb(last)

        if(gameStatus.roundsRemaining > 1){
            updateScoreAndRemoveClimbFromChoices(score);
        } else {
            setGameStatus({
                areasSelected: gameStatus.areasSelected,
                climbs: gameStatus.climbs,
                mode: GameMode.GameOver,
                roundsRemaining: 0,
                score: gameStatus.score + score,
            })
        }
        
    }

    const handleCenterMap = (newCenter: {lat:number, lng:number}) => {
        if(map){
            map.panTo(newCenter)
            //@ts-expect-error ts claims that map.zetzoom doesn't exist, but it does
            map.setZoom(18); 
        }
    }

    return(
        <>
            <div className="container">
                <GameUI 
                    currentClimb={currentClimb} 
                    gameStatus={gameStatus}
                    handleCenterMap={handleCenterMap}
                    totalRounds={totalRounds}/>
                <MapComponent 
                    currentClimb={currentClimb} 
                    lastClimb={lastClimb} 
                    handleGuess={handleGuess}
                    map={map}
                    //@ts-expect-error don worry about it
                    setMap={setMap} 
                    gameStatus={gameStatus}/>
            </div>
        </>
    )
}