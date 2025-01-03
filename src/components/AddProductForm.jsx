import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import "../styles/AddMachineForm.css";

const AddProductForm = ({ setShouldFetchProducts , initialData, onSubmit}) => {
    const [formData, setFormData] = useState(initialData || {
        image_url: "",
        name: "",
        price: "",
        description: ""
    
    });

    const dispatch = useDispatch();

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
                dispatch(updateProduct(response.data));
            } else {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/admin/add_machine",
                    formData
                );
                dispatch(addProduct(response.data));
                setFormData({ image_url: "",
                    name: "",
                    price: "",
                    description: ""});
            }

            setShouldFetchProducts(true);
            if (onSubmit) {
                onSubmit(formData);
            }
        } catch (error) {
            console.error("Error processing machine:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="add-machine-form">
                <h3>{initialData ? "Edit Machine" : "Add New Machine"}</h3>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="product name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Price: </label>
                    <input
                        type="number"
                        step="0.1"
                        name="product price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="add-machine-button">{initialData ? "Update Product" : "Add Product"}</button>
            </form>
        </div>
            
    );
};

export default AddProductForm;
