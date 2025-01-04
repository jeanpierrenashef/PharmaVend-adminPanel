import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import "../../styles/AddMachineForm.css";
import { updateProduct, addProduct } from "../../redux/products/slice";
import "../../styles/AddProductForm.css"

const AddProductForm = ({ setShouldFetchProducts , initialData, onSubmit}) => {
    const [formData, setFormData] = useState(initialData || {
        image_url: "",
        name: "",
        price: "",
        category: "",
        description: ""
    
    });

    const dispatch = useDispatch();
    const [imagePreview, setImagePreview] = useState(formData.image_url || "");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({ ...formData, image_url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (initialData) {
                const response = await axios.put(
                    `http://127.0.0.1:8000/api/admin/products/${formData.id}`,
                    formData
                );
                dispatch(updateProduct(response.data));
            } else {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/admin/add_product",
                    formData
                );
                dispatch(addProduct(response.data));
                setFormData({ 
                    image_url: "",
                    name: "",
                    price: "",
                    category: "",
                    description: ""
                });
                    setImagePreview("");
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
            <form onSubmit={handleSubmit} className="add-form">
            <h3>{initialData ? "Edit Product" : "Add New Product"}</h3>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Category:</label>
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Price:</label>
                <input
                    type="number"
                    step="0.1"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Description:</label>
                <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Image:</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                    </div>
                )}
            </div>
            <button type="submit" className="add-button">
                {initialData ? "Update Product" : "Add Product"}
            </button>
        </form>
            
    );
};

export default AddProductForm;
