import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const MapComponent = ({ machines }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyBblu-ime4U7pTC4ILi9CJmQeAYkvBdmG0", 
        
    });
    const center = { lat: 33.8892, lng: 35.4827 };
    const zoomLevel = 8;

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ width: "800px", height: "300px" }}>
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={zoomLevel}
        >
            {machines.map((machine) => (
            <Marker
                key={machine.id}
                position={{ lat: parseFloat(machine.latitude), lng: parseFloat(machine.longitude) }}
                title={machine.location}
            />
            ))}
        </GoogleMap>
        </div>
    );
};

export default MapComponent;
