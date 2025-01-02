import React from "react";

const InventoryRow = ({ product, quantity, onUpdateQuantity }) => {
    return (
        <tr>
            <td>{product?.id }</td>
            <td>{product?.name || "Unknown"}</td>
            <td>
            <button
                    className="action-button subtract-button"
                    onClick={() => onUpdateQuantity(product.id, -1)}
                    title="Decrease Quantity"
                >
                    <i className="mdi mdi-minus-circle-outline"></i>
                </button>
                {quantity}
                <button
                    className="action-button add-button"
                    onClick={() => onUpdateQuantity(product.id, 1)}
                    title="Increase Quantity"
                >
                    <i className="mdi mdi-plus-circle-outline"></i>
                </button>
            </td>
        </tr>
    );
};

export default InventoryRow;
