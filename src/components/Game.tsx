import { useEffect, useState } from "react"
import Map from "./Map";
import GameUI from "./GameUI";
import { getRandomFromClimbIDs } from "../helpers/climbFinderHelper";
import { requestGET, requestPOST } from "../helpers/sendRequest";
import _ from 'lodash';
import calculateScore from "../helpers/calculateScore";

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

export default function Game() {
    const [gameStatus, setGameStatus] = useState({roundsLeft: 5, isActive: true});
    const [areas, setAreas] = useState([]);
    const [currentArea, setCurrentArea] = useState(null);
    const [climbs, setClimbs] = useState([]);
    const [currentClimb, setCurrentClimb] = useState(null);
    const [lastClimb, setLastClimb] = useState(null);
    const [score, setScore] = useState(0);

    // These three hooks populate all of the states above in concurrent order
    useEffect(() => {
        async function getAreas() {
            const url = sessionStorage.getItem("apiURL") + "/areas";
            const areas = await requestGET(url);

            if(areas) {
                console.log("setting areas?")
                setCurrentArea(areas[0]);
                setAreas(areas);
            }
        }
        getAreas();
    }, [])

    useEffect(()=> {
        async function getClimbs(area: Area) {
            const url = sessionStorage.getItem("apiURL") + "/climbs";
            const body = {"trim_data":true,"area_id":area._id};
            
            const allClimbs = await requestPOST(url, body);

            if(allClimbs) {
                const randomClimbs = getRandomFromClimbIDs(gameStatus.roundsLeft, allClimbs);
                setClimbs(randomClimbs);
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
        setGameStatus({roundsLeft:gameStatus.roundsLeft-1, isActive:gameStatus.isActive})
    }

    const handleGameChoice = (choiceResponse) => {
        console.log("Handling game logic with response: ", choiceResponse);
        const last :Climb = choiceResponse.correct_climb;
        setLastClimb(last)
        setScore(score + calculateScore(choiceResponse.distance))

        if(gameStatus.roundsLeft > 1){
            removeCurrentClimbFromAvailableChoices();
        } else {
            setGameStatus({roundsLeft:0, isActive:false});
        }
        
    }

    return(
        <>
            <div className="container">
                <GameUI currentClimb={currentClimb} score={score} gameStatus={gameStatus} areas={areas}/>
                <Map currentClimb={currentClimb} lastClimb={lastClimb} handleChoiceCallback={handleGameChoice} gameStatus={gameStatus}/>
            </div>
        </>
    )
}