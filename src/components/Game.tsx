import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Map from "./Map";
import GameUI from "./GameUI";
import { getRandomFromClimbIDs } from "../helpers/climbFinderHelper";
import { requestGET, requestPOST } from "../helpers/sendRequest";
import _, { isArray } from 'lodash';
import calculateScore from "../helpers/calculateScore";
import { GameMode, GameStatus } from "../App";

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
    selected: boolean
}

interface Props {
    gameStatus: GameStatus,
    setGameStatus: Dispatch<SetStateAction<GameStatus>>
}

export default function Game({gameStatus, setGameStatus} :Props) {
    //const [gameStatus, setGameStatus] = useState({roundsLeft: 5, isActive: true});
    const [areas, setAreas] = useState([]);
    const [currentArea, setCurrentArea] = useState<Area | null>(null);
    const [climbs, setClimbs] = useState<Array<Climb>>([]);
    const [currentClimb, setCurrentClimb] = useState<Climb | null>(null);
    const [lastClimb, setLastClimb] = useState<Climb | null>(null);
    const [score, setScore] = useState(0);

    // These three hooks populate all of the states above in concurrent order
    useEffect(() => {
        async function getAreas() {
            const url = sessionStorage.getItem("apiURL") + "/areas";
            const areas= await requestGET(url);

            if(areas) {
                console.log("setting areas?", areas)
                setCurrentArea(areas[0]); // should be updated to reflect what user selected
                setGameStatus({
                    mode: gameStatus.mode,
                    areasSelected: areas,
                    roundsRemaining: gameStatus.roundsRemaining,
                    score: gameStatus.score
                })
                setAreas(areas);
            }
        }
        getAreas();
    }, [])

    useEffect(()=> {
        async function getClimbs(area: Area) {
            const url = sessionStorage.getItem("apiURL") + "/climbs";
            const body = {"trim_data":true,"area_id":area._id};
            
            const allClimbs : Array<Climb> | null | object = await requestPOST(url, body);

            if(isArray(allClimbs)) {
                const randomClimbs = getRandomFromClimbIDs(gameStatus.roundsRemaining, allClimbs);
                setClimbs(randomClimbs);
            } else {
                console.error("Improper format from getClimbs request");
            }
        }

        if(currentArea){
            getClimbs(currentArea);
        }
    }, [currentArea]);

    useEffect(()=> {
        if(climbs.length === 0) { return; }

        const climb = climbs[_.random(0,climbs.length-1)]
        console.log("Updating current climb to: ", climb);
        setCurrentClimb(climb);
    }, [climbs])

    const removeCurrentClimbFromAvailableChoices = () => {
        const index = climbs.findIndex((element) => element == currentClimb)
        const updatedClimbs = climbs;
        updatedClimbs.splice(index, 1);
        setClimbs(updatedClimbs.slice());
        const updatedStatus = gameStatus;
        updatedStatus.roundsRemaining -= 1;
        setGameStatus(updatedStatus)
        //setGameStatus({roundsLeft:gameStatus.roundsLeft-1, isActive:gameStatus.isActive})
    }

    const handleGameChoice = (choiceResponse) => {
        console.log("Handling game logic with response: ", choiceResponse);
        const last :Climb = choiceResponse.correct_climb;
        const score: number = calculateScore(choiceResponse.distance);
        setLastClimb(last)
        setGameStatus({
            areasSelected: gameStatus.areasSelected,
            mode: gameStatus.mode,
            roundsRemaining: gameStatus.roundsRemaining,
            score: gameStatus.score + score,
        })

        if(gameStatus.roundsRemaining > 1){
            removeCurrentClimbFromAvailableChoices();
        } else {
            setGameStatus({
                areasSelected: gameStatus.areasSelected,
                mode: GameMode.GameOver,
                roundsRemaining: 0,
                score: gameStatus.score + score,
            })
        }
        
    }

    return(
        <>
            <div className="container">
                <GameUI currentClimb={currentClimb} gameStatus={gameStatus}/>
                <Map currentClimb={currentClimb} lastClimb={lastClimb} handleChoiceCallback={handleGameChoice} gameStatus={gameStatus}/>
            </div>
        </>
    )
}