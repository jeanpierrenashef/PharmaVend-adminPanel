import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { addMachine, updateMachine } from "../../redux/machines/slice";
import "../../styles/AddMachineForm.css";
import MapPicker from "./MapPicker";
import googleInstance from "../../utils/googleInstance";

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
                const response = await axiosInstance.put(
                    `/admin/machines/${formData.id}`,
                    formData
                );
                dispatch(updateMachine(response.data));
            } else {
                const response = await axiosInstance.post(
                    "/admin/add_machine",
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
            console.error("Error", error);
        }
    };

    const handleLocationResponse = async (latitude, longitude) => {
        try {
            const apiKey = process.env.REACT_APP_API_KEY;
            const response = await googleInstance.get('', {
                params: {
                    latlng: `${latitude},${longitude}`,
                    key: apiKey
                }
            });
    
            const results = response.data.results;
            const addressComponents = results[0].address_components;
            const plus_code = addressComponents.find(item => item.types.includes('plus_code'))?.long_name || '';
            const admin_area_level_2 = addressComponents.find(item => item.types.includes('administrative_area_level_2'))?.long_name || '';
            const admin_area_level_1 = addressComponents.find(item => item.types.includes('administrative_area_level_1'))?.long_name || '';
            const formatted_address = `${admin_area_level_2}, ${admin_area_level_1}, ${plus_code}`;
    
            setFormData({
                ...formData,
                location: formatted_address,
                latitude,
                longitude,
            });
            console.log("Location updated:", formatted_address);
        } catch (error) {
            console.error("Failed", error);
        }
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    handleLocationResponse(latitude.toFixed(4), longitude.toFixed(4));
                    
                },
                (error) => {
                    console.log("Failed.");
                }
            );
        } else {
            console.log("Geolocation is not supported.");
            
        }
    };

    const handleMapLocationSelect = (location) => {
        handleLocationResponse(location.lat.toFixed(4), location.lng.toFixed(4));
        setShowMapPicker(false);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="add-form">
                <h3>{initialData ? "Edit Machine" : "Add New Machine"}</h3>
                <div>
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Latitude</label>
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
                    <label>Longitude</label>
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
                    <button onClick={() => setShowMapPicker(true)}>Close Map</button>
                </div>
                )}
        </div>
            
    );
};

export default AddMachineForm;
