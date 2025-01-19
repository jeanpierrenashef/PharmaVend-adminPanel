import React, { useState } from "react";
import "../../styles/ProductContainer.css";

const ProductContainer = ({ product, onEdit, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <div className="product-card">
        <div className="menu-container">
            <button className="menu-button" onClick={toggleMenu}>
                <i className="mdi mdi-dots-vertical"></i>
            </button>
            {isMenuOpen && (
            <div className="dropdown-menu">
                <button
                    className="action-button edit-button"
                    onClick={() => {
                        onEdit(product);
                        setIsMenuOpen(false);
                    }}
                    >
                    <i className="mdi mdi-pencil-outline"></i>
                </button>
                <button
                    className="action-button delete-button"
                    onClick={() => {
                        onDelete(product.id);
                        setIsMenuOpen(false);
                    }}
                    >
                    <i className="mdi mdi-trash-can-outline"></i>
                </button>
            </div>
            )}
        </div>

        {/* Product image */}
        <img
            src={product.image_url || "https://via.placeholder.com/150"}
            alt={product.name}
            className="product-image"
        />

        {/* Product title */}
        <div className="product-title">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
        </div>

        {/* Product details */}
        <div className="product-details">
            <p>
            <span className="category">Category:</span> {product.category}
            </p>
            <p>{product.description}</p>
        </div>
        </div>
    );
};

export default ProductContainer;
