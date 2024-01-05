type jwToken = string | null;


export async function requestPOST(url: string, body: object): Promise<object | null>{
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
        res = await response.json();
    }  
    
    return res;
}

export async function requestGET(url: string): Promise<object>{

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
        res.ok = false;
    }
    else {
        res = await response.json();
        res.ok = true;
    }  
    
    return res;
}

