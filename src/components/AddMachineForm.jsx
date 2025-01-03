import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addMachine, updateMachine } from "../redux/machines/slice";
import "../styles/AddMachineForm.css";
import MapPicker from "./MapPicker";

const AddMachineForm = ({ setShouldFetchMachines , initialData, onSubmit}) => {
    const [formData, setFormData] = useState(initialData || {
        location: "",
        latitude: "",
        longitude: "",
        status: "inactive"
    
    });

    const dispatch = useDispatch();
    const [showMapPicker, setShowMapPicker] = useState(false);

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

    const handleMapLocationSelect = (location) => {
        setFormData({
        ...formData,
        latitude: location.lat.toFixed(4),
        longitude: location.lng.toFixed(4),
        });
        setShowMapPicker(false);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="add-form">
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
                <div className="button-options">
                    <button type="button" onClick={handleGetCurrentLocation} className="get-location-button">
                        Get Current Location
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowMapPicker(true)}
                        className="get-location-button"
                        >
                        Pick Location on Map
                    </button>
                </div>
                <button type="submit" className="add-button">{initialData ? "Update Machine" : "Add Machine"}</button>
            </form>
            {showMapPicker && (
                <div className="map-picker-modal">
                    <MapPicker onLocationSelect={handleMapLocationSelect} />
                    <button onClick={() => setShowMapPicker(false)}>Close Map</button>
                </div>
                )}
        </div>
            
    );
};

export default AddMachineForm;
