import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addMachine } from "../redux/machines/slice";
import "../styles/AddMachineForm.css"

const AddMachineForm = () => {
    const [formData, setFormData] = useState({
        location: "",
        latitude: "",
        longitude: "",
        status: "inactive", // Default status
    });
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/admin/add_machine", formData);
            const newMachine = response.data;

            dispatch(addMachine(newMachine)); 
            setFormData({ location: "", latitude: "", longitude: "", status: "inactive" }); 
            alert("Machine added successfully!");
        } catch (error) {
            console.error("Error adding machine:", error);
            alert("Failed to add machine. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-machine-form">
            <h3>Add New Machine</h3>
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
                    step="0.000001"
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
                    step="0.000001"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Status:</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
            <button type="submit" className="add-machine-button">
    Add Machine
</button>
        </form>
    );
};

export default AddMachineForm;
