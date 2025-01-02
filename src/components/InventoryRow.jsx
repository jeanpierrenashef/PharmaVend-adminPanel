import React from "react";

const InventoryRow = ({ product, quantity, onUpdateQuantity }) => {
    return (
        <tr>
            <td>{product?.id }</td>
            <td>{product?.name || "Unknown"}</td>
            <td>
                <div className="quantity-controls">
                    <button
                        className="action-button subtract-button"
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        title="Decrease Quantity"
                    >
                        <i className="mdi mdi-minus-circle-outline"></i>
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button
                        className="action-button add-button"
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        title="Increase Quantity"
                    >
                        <i className="mdi mdi-plus-circle-outline"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default InventoryRow;
