import { Dispatch, EventHandler, MouseEventHandler, SetStateAction, useEffect, useState } from "react"
import { GameMode, GameStatus } from "../App"
import { Area, Climb } from "./Game"
import { requestGET, requestPOST } from "../helpers/sendRequest"

enum RoundEnum {
    "Five" = 5,
    "Ten" = 10,
    "Twenty" = 20
}

interface RoundSelectButton {
    rounds: RoundEnum,
    selected: boolean,
} 

interface Props {
    gameStatus: GameStatus,
    setGameStatus: Dispatch<SetStateAction<GameStatus>>
}

export default function Menu({gameStatus, setGameStatus}: Props) {
    // Menu to show up on initial launch
    // landing page to select areas and explain game

    // init buttons for round selection
    const [selectedRoundOption, setSelectedRoundOption] = useState<number>(RoundEnum.Five);
    const [selectRoundButtons, setSelectRoundButtons] = useState<Array<RoundSelectButton>>([
        { rounds: RoundEnum.Five, selected: true },
        { rounds: RoundEnum.Ten, selected: false },
        { rounds: RoundEnum.Twenty, selected: false },
    ])

    // get all available areas
    const [allAreas, setAllAreas] = useState<Array<{areaObj: Area, selected: boolean}>>([]);
    useEffect(() => {
        async function getAreas() {
            const url = sessionStorage.getItem("apiURL") + "/areas";
            const areas = await requestGET(url);
            const allAreas :Array<{areaObj: Area, selected: boolean}> = [];
            areas.forEach((area) => allAreas.push({areaObj: area, selected: false}))
            setAllAreas(allAreas);
        }
        getAreas();
    }, [])

    // let player select which areas are included in game

    // player initiates game start
    const populateGame :Promise<Array<Climb>> = async (numClimbs: number, areas: Array<Area>) => {
        const bodyContent = {numClimbsRequested: numClimbs, 
                            areas: areas}
        const url = sessionStorage.getItem("apiURL") + "/populateboulders";

        const token :  string | null = sessionStorage.getItem("token");
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token ? token : ""}`
            },
            body: JSON.stringify(bodyContent),
        });

        const climbs :Array<Climb>= []
        if(!response.ok) {
            // handle errors
            const err = await response.json();
            console.error(err);
            return null;
        }
        else {
            console.log("Successfully returning POST request");
            const res = await response.json();
            climbs.push(...res);
        }
    
        return climbs;
    }

    const handleGameStart = async () => {
        console.log("Starting Game");
        const selectedAreas :Array<Area>= [];
        allAreas.forEach((area) => (area.selected ? selectedAreas.push(area.areaObj) : null))        
        const climbs :Array<Climb> = await populateGame(selectedRoundOption, selectedAreas);
        console.log("in handle game start", climbs);
        setGameStatus({
            mode: GameMode.Running,
            climbs: climbs,
            areasSelected: selectedAreas,
            roundsRemaining: selectedRoundOption,
            score: 0
        });

    }
    
    const handleZoneSelection : React.MouseEventHandler<HTMLButtonElement> = (e) => {
        const selectedID = e.currentTarget.value;
        const selectedIndex = allAreas.findIndex((area) => area.areaObj._id === selectedID);
        allAreas[selectedIndex].selected = !allAreas[selectedIndex].selected;
        setAllAreas(allAreas.slice());
    }

    const handleRoundSelection : React.MouseEventHandler<HTMLButtonElement> = (e) => {
        const buttonIndex = Number(e.currentTarget.value);
        selectRoundButtons.forEach((button, index) => {
            button.selected = false;
            if(index === buttonIndex) {
                button.selected = true;
                setSelectedRoundOption(button.rounds);
            }
        })
        setSelectRoundButtons(selectRoundButtons.slice());
    }

    return(
        <>
            <div className="container">
                <div className="jumbotron">
                    <h1 className="display-4">Menu</h1>
                    <div className="container">
                        <h4 className="display">Select Zones</h4>
                        <p>The more zones you select, the higher your point multiplier will be.</p>
                        <div className="button-group">
                            {allAreas.map((area) => (
                                <button className={area.selected?"btn btn-success active":"btn btn-outline-dark"}
                                        key={area.areaObj._id}
                                        id={area.areaObj._id+"-button"}
                                        value={area.areaObj._id}
                                        onClick={handleZoneSelection}>
                                            {area.areaObj.name}            
                                </button>
                            ))}   
                        </div>
                    </div>
                    <hr className="my-4"/>
                    <div className="container">
                    <h4 className="display">How many rounds?</h4>
                        <p>More rounds means more points.</p>
                        <div className="button-group">
                            {selectRoundButtons.map((button, index) => (
                                <button className={button.selected?"btn btn-success active":"btn btn-outline-dark"}
                                key={button.rounds}
                                value={index}
                                onClick={handleRoundSelection}>
                                    {button.rounds}
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="my-4"></hr>
                    <button className="btn btn-primary btn-lg" onClick={handleGameStart}>Start Game</button>
                </div>
            </div>
        </>
    )
}