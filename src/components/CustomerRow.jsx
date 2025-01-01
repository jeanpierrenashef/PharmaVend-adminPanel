import React from "react";

const CustomerRow = ({ customer, onDelete }) => {
    return (
        <tr>
            <td>#00{customer.id}</td>
            <td>{customer.username}</td>
            <td>{customer.email}</td>
            <td>{customer.totalOrders}</td>
            <td>{new Date(customer.created_at).toISOString().split("T")[0]}</td>
            <td>
                <button
                    className="action-button delete-button"
                    onClick={() => onDelete(customer.id)}
                    title="Delete User"
                >
                    <i className="mdi mdi-trash-can-outline"></i>
                </button>
            </td>
        </tr>
    );
};

export default CustomerRow;
