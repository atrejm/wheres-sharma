import { useEffect, useState } from "react"
import Map from "./Map";
import GameUI from "./GameUI";
import { getRandomFromClimbIDs } from "../helpers/climbFinderHelper";
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
            const response: Response = await fetch(`http://localhost:3000/api/areas`, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if(!response.ok) {
                // handle errors
                console.error(response);
            }
            else {
                const responseJSON = await response.json();
                const areas :Array<Area> = [];
                responseJSON.forEach(element => {
                    areas.push({_id: element._id, name: element.name, selected:true})
                });
                
                setCurrentArea(areas[0]);
                setAreas(areas);
            } 
        }
        getAreas();
    }, [])

    useEffect(()=> {
        async function getClimbs(area: Area) {
            const response: Response = await fetch(`http://localhost:3000/api/climbs`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"trim_data":true,"area_id":area._id})
            });

            if(!response.ok) {
                // handle errors
                console.error(response);
            }
            else {
                const responseJSON :Array<Climb> = await response.json();
                const randomClimbs = getRandomFromClimbIDs(gameStatus.roundsLeft, responseJSON);
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

    const handleGameChoice = (responseJSON) => {
        console.log("Handling game logic with response: ", responseJSON);
        const last :Climb = responseJSON.correct_climb;
        setLastClimb(last)
        setScore(score + calculateScore(responseJSON.distance))

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