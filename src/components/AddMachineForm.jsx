import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addMachine, updateMachine } from "../redux/machines/slice";
import "../styles/AddMachineForm.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const LocationPicker = ({ setLocation }) => {
    useMapEvents({
        click: (e) => {
            setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });

    return null;
};
const AddMachineForm = ({ setShouldFetchMachines , initialData, onSubmit}) => {
    const [formData, setFormData] = useState(initialData || {
        location: "",
        latitude: "",
        longitude: "",
        status: "inactive"
    
    });

    const dispatch = useDispatch();
    const [isMapOpen, setIsMapOpen] = useState(false); 
    const [markerPosition, setMarkerPosition] = useState(null); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (initialData) {
                const response = await axios.put(
                    `http://127.0.0.1:8000/api/admin/machines/${formData.id}`,
                    formData
                );
                dispatch(updateMachine(response.data));
            } else {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/admin/add_machine",
                    formData
                );
                dispatch(addMachine(response.data));
                setFormData({ location: "", latitude: "", longitude: ""});
            }

            setShouldFetchMachines(true);
            if (onSubmit) {
                onSubmit(formData);
            }
        } catch (error) {
            console.error("Error processing machine:", error);
        }
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        latitude: position.coords.latitude.toFixed(4),
                        longitude: position.coords.longitude.toFixed(4),
                    });
                    console.log("Location fetched successfully!");
                },
                (error) => {
                    console.log("Failed to fetch location. Please allow location access.");
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
            
        }
    };

    const openMap = () => {
        setIsMapOpen(true);
    };

    const closeMap = () => {
        setIsMapOpen(false);
    };

    const handleMapSelect = () => {
        if (markerPosition) {
            setFormData({
                ...formData,
                latitude: markerPosition.lat.toFixed(4),
                longitude: markerPosition.lng.toFixed(4),
            });
            closeMap();
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="add-machine-form">
                <h3>{initialData ? "Edit Machine" : "Add New Machine"}</h3>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Latitude:</label>
                    <input
                        type="number"
                        step="0.0001"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Longitude:</label>
                    <input
                        type="number"
                        step="0.0001"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <button type="button" onClick={handleGetCurrentLocation} className="get-location-button">
                        Get Current Location
                    </button>
                    <button type="button" onClick={openMap} className="open-map-button">
                        Open Map
                    </button>
                </div>
                <button type="submit" className="add-machine-button">{initialData ? "Update Machine" : "Add Machine"}</button>
            </form>
            {isMapOpen && (
                <div className="map-modal">
                    <div className="map-container">
                        <MapContainer
                            center={[51.505, -0.09]}
                            zoom={13}
                            style={{ height: "400px", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationPicker setLocation={setMarkerPosition} />
                            {markerPosition && <Marker position={markerPosition}></Marker>}
                        </MapContainer>
                        <div className="map-actions">
                            <button onClick={handleMapSelect}>Set Location</button>
                            <button onClick={closeMap}>Cancel</button>
                        </div>
                    </div>
                </div>
            )} 
        </div>
            
    );
};

export default AddMachineForm;
