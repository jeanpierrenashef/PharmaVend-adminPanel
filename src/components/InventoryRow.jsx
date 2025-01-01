import React from "react";

const InventoryRow = ({ product, quantity }) => {
    return (
        <tr>
            <td>{product?.id || "N/A"}</td>
            <td>{product?.name || "Unknown"}</td>
            <td>{quantity}</td>
        </tr>
    );
};

export default InventoryRow;
