import React from "react";
import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const defaultCenter = {
    lat: 33.896542,
    lng: 35.478621, 
};

const MapPicker = ({ onLocationSelect }) => {
    const [markerPosition, setMarkerPosition] = useState(null);

    const handleMapClick = (event) => {
        const newLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        };
        setMarkerPosition(newLocation);
        if (onLocationSelect) {
        onLocationSelect(newLocation);
        }
    };

    return (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={10}
                onClick={handleMapClick}
            >
                {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapPicker;