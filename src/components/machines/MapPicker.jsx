import React, { useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

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
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={8}
            onClick={handleMapClick}
        >
            {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
    );
};

export default MapPicker;
