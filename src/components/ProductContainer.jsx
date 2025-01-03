import React from "react";
import "../styles/ProductContainer.css";

const ProductContainer = ({ product }) => {

    return (
        <div className="product-card">
            <img
                src={product.image_url || "https://via.placeholder.com/150"}
                alt={product.name}
                className="product-image"
            />
            <div className="product-details">
                <div className="product-title">
                    <h3>{product.name}</h3>
                    <p>${product.price}</p>
                </div>
                <p>ID: {product.id}</p>
                <p>{product.category}</p>
                <p>{product.description}</p>
                
            </div>
            <div className="product-actions">
                <button className="edit-button">
                    <i className="mdi mdi-pencil"></i>
                </button>
                <button className="delete-button">
                    <i className="mdi mdi-delete"></i>
                </button>
            </div>
        </div>
    );
};

export default ProductContainer;