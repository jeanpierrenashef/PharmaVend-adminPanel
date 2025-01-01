import React from "react";

const CustomerRow = ({ customer }) => {
    return (
        <tr>
            <td>#00{customer.id}</td>
            <td>{customer.username}</td>
            <td>{customer.email}</td>
            <td>{customer.totalOrders}</td>
            <td>{new Date(customer.created_at).toISOString().split("T")[0]}</td>
        </tr>
    );
};

export default CustomerRow;
