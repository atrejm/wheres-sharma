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
        return null;
    }
    else {
        res = await response.json();
    }  
    
    return res;
}

