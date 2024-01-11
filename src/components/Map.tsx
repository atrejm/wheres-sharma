// @ts-nocheck

import { Dispatch, SetStateAction, useState } from 'react'
import '../styles/Map.css'
import '../helpers/sendRequest'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { requestPOST } from '../helpers/sendRequest';
import { GameMode, GameStatus } from '../App';
import { Climb } from './Game';

interface Props{
    currentClimb: Climb | null;
    lastClimb: Climb | null;
    handleGuess: ({correct_climb, distance} : {correct_climb:Climb, distance: number})=>void;
    gameStatus: GameStatus;
    map: GoogleMap | null;
    setMap: Dispatch<SetStateAction<GoogleMap>> | null;
}

interface GoogleMapClickEvent{
    latLng: {
        lat: () => void,
        lng: () => void
    }
}

interface Point{
    lat: number,
    lng: number
}

export default function MapComponent({currentClimb, lastClimb, handleGuess: handleGuess, gameStatus, map, setMap} : Props) {
    const [lastClickedPoint, setLastClickedPoint] = useState<Point | null>(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyD5utk1xIwttC4SVfLYdjVyXjYfwwbz2K0"
    })

    const defaultProps = {
        center: {
            lat: gameStatus.areasSelected[0].lat, 
            lng: gameStatus.areasSelected[0].lng
        },
        zoom: 10
    };

    const onClick = async (mapMouseEvent: GoogleMapClickEvent) => {
        const lat = mapMouseEvent.latLng.lat();
        const lng = mapMouseEvent.latLng.lng();

        const payload = { target_id:`${currentClimb._id}`,lat: lat, lng: lng }
        const url = sessionStorage.getItem("apiURL");
        const response = await requestPOST(url, payload);
        
        if(response){
            setLastClickedPoint({lat:lat, lng:lng});
            handleGuess(response);
        }
        
    };

    const onLoad = (map) => {
        const bounds = new window.google.maps.LatLngBounds(defaultProps.center);
        map.fitBounds(bounds);
        map.setMapTypeId('satellite');
        //map.addListener("click", onClick)
        setMap(map);
    }
    
    const onUnmount = () => {
        setMap(null);
    }

    if(lastClimb) {
        const startMarker = new window.google.maps.Marker({
            map:map,
            position: lastClickedPoint,
            opacity: 0.5,
            title: `Your guess`
        });

        const endMarker = new window.google.maps.Marker({
            map: map,
            position: {lat: lastClimb.lat, lng:lastClimb.lng}
        });

        const infoWindow = new window.google.maps.InfoWindow({
            content: `${lastClimb.name}`,
            position: endMarker.position,
        })

        infoWindow.open({
            anchor: endMarker,
            map: map,
            shouldFocus: false,
        })

        new window.google.maps.Polyline({
            path:[startMarker.position, endMarker.position],
            map:map
        });

        map.panTo(endMarker.position);
    }

    return (isLoaded?
        <>
            <div>

            </div>
            <div className='google-map container p-0'>
                <GoogleMap
                    mapContainerStyle={{width: "100%", height: "100%"}}
                    zoom={17}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={gameStatus.mode === GameMode.Running ? onClick : null}
                >
                </GoogleMap>
            </div>
        </>
        :
        <></>
    )
}
