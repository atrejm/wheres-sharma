//@ts-nocheck

import { Dispatch, EventHandler, HTMLInputTypeAttribute, MouseEventHandler, SetStateAction, useEffect, useState } from "react"
import { GameMode, GameStatus } from "../App"
import { Area, Climb } from "./Game"
import { requestGET, requestPOST } from "../helpers/sendRequest"

enum RoundEnum {
    "Three" = 3,
    "Five" = 5,
    "Eight" = 8
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

    const [, forceRender] = useState< undefined| boolean >(undefined);
    // init buttons for round selection
    const [selectedRoundOption, setSelectedRoundOption] = useState<number>(RoundEnum.Three);
    const [selectRoundButtons, setSelectRoundButtons] = useState<Array<RoundSelectButton>>([
        { rounds: RoundEnum.Three, selected: true },
        { rounds: RoundEnum.Five, selected: false },
        { rounds: RoundEnum.Eight, selected: false },
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

    const [zoneError, setZoneError] = useState(null);
    const handleGameStart = async () => {
        const selectedAreas :Array<Area>= [];
        allAreas.forEach((area) => (area.selected ? selectedAreas.push(area.areaObj) : null))        
        const climbs :Array<Climb> = await populateGame(selectedRoundOption, selectedAreas);
        if(selectedAreas.length === 0) {
            setZoneError("You must choose at least one Zone");
            return;
        }
        setZoneError(null);
        console.log("Starting game with:", climbs);
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

    // handle username signup and login
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleUsernameChange : React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange : React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.target.value);
    }

    const handleLogin : React.FormEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();
        const url = sessionStorage.getItem("apiURL") + "/login";
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username:username, password:password}),
        });

        if(!response.ok) {
            // handle errors
            console.error(response);
        }
        else {
            const resJSON = await response.json();
            if(resJSON.error) {
                setError(resJSON.error);
            } else {
                setError(null);
                sessionStorage.setItem("token", resJSON.jwtToken);
                sessionStorage.setItem("userID", resJSON.user._id);
                sessionStorage.setItem("username", resJSON.user.username);

                forceRender((prev) => !prev);
            }
        }
    }

    const handleRegister : React.FormEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();
        const url = sessionStorage.getItem("apiURL") + "/register";
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username:username, password:password}),
        });

        if(!response.ok) {
            // handle errors
            console.error(response);
        }
        else {
            const resJSON = await response.json();
            if(resJSON.error) {
                setError(resJSON.error);
            } else {
                setError(null);
                sessionStorage.setItem("token", resJSON.jwtToken);
                sessionStorage.setItem("userID", resJSON.user._id);
                sessionStorage.setItem("username", resJSON.user.username);

                forceRender((prev) => !prev)
            }
        }
    }

    return(
        <>
            <div className="container">
                <div className="jumbotron">
                    <h1 className="display-4">Menu</h1>
                    <div className="container">
                        <h4 className="display">Select Zones</h4>
                        <p>The more zones you select, the higher your point multiplier will be.</p>
                        {zoneError?<div><small className="alert alert-danger p-1">{zoneError}</small></div>:<></>}
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
                    {sessionStorage.getItem("username") ?
                    <div className="container">
                        Welcome, {sessionStorage.getItem("username")}
                    </div>
                    :
                    <div className="container">
                        <form>
                            <div className="form-group" style={{maxWidth:"30em"}}>
                                <small className="text-muted">If you want your score on the leaderboard, you must be logged in</small>
                                {error ?
                                <div className="alert alert-danger p-1" role="alert">
                                    <small className="text-error">{error}</small>
                                </div>
                                :
                                <></>
                                }
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="username" 
                                        placeholder="Username"
                                        onChange={handleUsernameChange}></input>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="password" 
                                        placeholder="Password"
                                        onChange={handlePasswordChange}></input>
                                </div>
                            </div>
                            <div>
                                <button 
                                    type="submit" 
                                    className="btn btn-success btn-sm mx-1"
                                    onClick={handleLogin}>
                                        Login
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-success btn-sm mx-1"
                                    onClick={handleRegister}>
                                        Register
                                </button>
                            </div>
                        </form>
                    </div>      
                    }

                    <hr className="my-4"></hr>
                    <div className="container">
                        <button className="btn btn-success btn-lg" onClick={handleGameStart}>Start Game</button>
                    </div>
                </div>
            </div>
        </>
    )
}