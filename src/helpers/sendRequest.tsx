import { Area, Climb } from "../components/Game";

type jwToken = string | null;


export async function requestPOST(url: string, body: object): Promise<object | Array<Climb> | null>{
    const payload = body;
    
    const token :jwToken = sessionStorage.getItem("token");
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token ? token : ""}`
        },
        body: JSON.stringify(payload),
    });

    let res;
    if(!response.ok) {
        // handle errors
        res = await response.json();
        console.error(res);
        return null;
    }
    else {
        console.log("Successfully returning POST request");
        res = await response.json();
    }  
    
    return res;
}

export async function requestGET(url: string): Promise<Array<Area>>{

    const token :jwToken = sessionStorage.getItem("token");
    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token ? token : ""}`
        }
    });

    let res;
    if(!response.ok) {
        // handle errors
        res = await response.json();
        console.error(res);
        return [];
    }
    else {
        res = await response.json();
    }  
    
    return res;
}

export async function uploadLatestGameScore(score: number, url : string, gameHistory: Array<object>) {
    const id = sessionStorage.getItem("userID");
    const token = sessionStorage.getItem("token");
    const requestURL = url + "/uploadscore";


    const response = await fetch(requestURL, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token ? token : ""}`
        },
        body: JSON.stringify({id: id, score: score, gameHistory: gameHistory})
    });

    if(!response.ok) {
        // handle errors
        console.error(response);
    }
    else {
        const resJSON = await response.json();
        console.log(resJSON);
    }
}

interface UserModelInstance {
    _id: string,
    username: string,
    password: string,
    highScore: number,
    gamehistory: Array<object>,
}

export async function requestHighScores (url : string) : Promise<Array<UserModelInstance>> {
    
    const requestURL = url + "/highscores";

    const response = await fetch(requestURL, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if(!response.ok) {
        // handle errors
        console.error(response);
        return []
    }
    else {
        const resJSON = await response.json();
        return resJSON;
    }
}

