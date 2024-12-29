import React from "react";

const OrderRow = ({ transaction, user }) => {
    return (
        <tr>
        <td>{transaction.id}</td>
        <td>{user?.username || "Unknown"}</td>
        <td>{user?.email || "Unknown"}</td>
        <td>{transaction.quantity}</td>
        <td>{transaction.total_price}</td>
        <td>{transaction.machine_id}</td>
        <td>{transaction.product_id}</td>
        <td>{transaction.created_at}</td>
        </tr>
    );
};

export default OrderRow;
