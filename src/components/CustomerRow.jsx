import React from "react";

const CustomerRow = ({ customer }) => {
    return (
        <tr>
            <td>{customer.id}</td>
            <td>{customer.name}</td>
            <td>{customer.email}</td>
            <td>{customer.totalOrders}</td>
            <td>{new Date(customer.created_at).toISOString().split("T")[0]}</td>
        </tr>
    );
};

export default CustomerRow;
