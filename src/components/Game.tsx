import { Dispatch, SetStateAction, useEffect, useState } from "react"
import MapComponent from "./Map";
import GameUI from "./GameUI";
import { getRandomFromClimbIDs } from "../helpers/climbFinderHelper";
import { requestGET, requestPOST } from "../helpers/sendRequest";
import _, { isArray } from 'lodash';
import calculateScore from "../helpers/calculateScore";
import { GameMode, GameStatus } from "../App";
import { GoogleMap, GoogleMapProps } from "@react-google-maps/api";

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
    const [climbs, setClimbs] = useState<Array<Climb>>([]);
    const [currentClimb, setCurrentClimb] = useState<Climb | null>(null);
    const [lastClimb, setLastClimb] = useState<Climb | null>(null);
    const [map, setMap] = useState<GoogleMap | null>(null);

    useEffect(()=> {
        if(gameStatus.climbs.length === 0) { return; }

        console.log(gameStatus.climbs);
        const climb = gameStatus.climbs[_.random(0,gameStatus.climbs.length-1)]
        console.log("Updating current climb to: ", climb);
        setCurrentClimb(climb);
    }, [gameStatus])

    const removeCurrentClimbFromAvailableChoices = () => {
        const index = gameStatus.climbs.findIndex((element) => element == currentClimb)
        const updatedClimbs = gameStatus.climbs
        updatedClimbs.splice(index, 1);
        setGameStatus({
            mode: gameStatus.mode,
            areasSelected: gameStatus.areasSelected,
            climbs: updatedClimbs,
            roundsRemaining: gameStatus.roundsRemaining - 1,
            score: gameStatus.score,
        })
        //setGameStatus({roundsLeft:gameStatus.roundsLeft-1, isActive:gameStatus.isActive})
    }

    const handleGuess = (choiceResponse: {correct_climb: Climb, distance: number}) => {
        console.log("Handling game logic with response: ", choiceResponse);
        const last :Climb = choiceResponse.correct_climb;
        const score: number = calculateScore(choiceResponse.distance);
        setLastClimb(last)
        setGameStatus({
            areasSelected: gameStatus.areasSelected,
            climbs: gameStatus.climbs,
            mode: gameStatus.mode,
            roundsRemaining: gameStatus.roundsRemaining,
            score: gameStatus.score + score,
        })

        if(gameStatus.roundsRemaining > 1){
            removeCurrentClimbFromAvailableChoices();
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
            map.setZoom(18);
        }
    }

    return(
        <>
            <div className="container">
                <GameUI 
                    currentClimb={currentClimb} 
                    gameStatus={gameStatus}
                    handleCenterMap={handleCenterMap}/>
                <MapComponent 
                    currentClimb={currentClimb} 
                    lastClimb={lastClimb} 
                    handleGuess={handleGuess}
                    map={map}
                    setMap={setMap} 
                    gameStatus={gameStatus}/>
            </div>
        </>
    )
}