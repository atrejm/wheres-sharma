import { useEffect, useState } from 'react'
import '../styles/Map.css'
import '../helpers/sendRequest'
import { GoogleMap, useJsApiLoader, Marker, useGoogleMap } from '@react-google-maps/api';
import { requestGET, requestPOST } from '../helpers/sendRequest';


export default function Map({currentClimb, lastClimb, handleChoiceCallback, gameStatus}) {
    const [map, setMap] = useState(null);
    const [lastClickedPoint, setLastClickedPoint] = useState(null);
    const [center, setCenter] = useState({
        lat: 37.329399, 
        lng: -118.577428
    });

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyD5utk1xIwttC4SVfLYdjVyXjYfwwbz2K0"
    })

    const defaultProps = {
        center: {
            lat: 37.329399, 
            lng: -118.577428
        },
        zoom: 0
    };

    const onClick = async (mapMouseEvent) => {
        const lat = mapMouseEvent.latLng.lat();
        const lng = mapMouseEvent.latLng.lng();

        console.log("Current climb: ", currentClimb, lat, lng);
        const payload = { target_id:`${currentClimb._id}`,lat: lat, lng: lng }
        const url = "http://localhost:3000/api";
        const response = await fetch(`http://localhost:3000/api`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if(!response.ok) {
            // handle errors
            console.error(response);
        }
        else {
            const responseJSON = await response.json();
            setLastClickedPoint({lat:lat, lng:lng});
            handleChoiceCallback(responseJSON);
            console.log(responseJSON)
        }  
    };

    const onLoad = (map) => {
        const bounds = new window.google.maps.LatLngBounds(defaultProps.center);
        map.fitBounds(bounds);
        map.setZoom(100000000);
        map.setMapTypeId('satellite');
        //map.addListener("click", onClick)
        setMap(map);
    }
    
    const onUnmount = (map) => {
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

        const polyLine = new window.google.maps.Polyline({
            path:[startMarker.position, endMarker.position],
            map:map
        });

        //marker.setMap(map);
        //polyLine.setMap(map);
        map.panTo(endMarker.position);
        console.log("New marker", endMarker);
    }

    return (isLoaded?
        <>
            <div>

            </div>
            <div className='google-map container p-0'>
                <GoogleMap
                    mapContainerStyle={{width: "100%", height: "80vh"}}
                    zoom={17}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={gameStatus.isActive ? onClick : null}
                >

                </GoogleMap>
            </div>
        </>
        :
        <></>
    )
}
