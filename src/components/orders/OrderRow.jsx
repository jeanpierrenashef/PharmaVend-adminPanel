import React from "react";

const OrderRow = ({ transaction, user, product }) => {
    const formattedDate = transaction.created_at.split("T")[0];
    return (
        <tr>
            <td>#000{transaction.id}</td>
            <td>{user?.username || "Unknown"}</td>
            <td>{transaction.quantity}</td>
            <td>${transaction.total_price}</td>
            <td>{product?.name}</td>
            <td>
                {transaction.dispensed === 1 ? (
                    <span className="status dispensed">
                        <i className="mdi mdi-check-circle"></i> Dispensed
                    </span>
                ) : (
                    <span className="status not-dispensed">
                        <i className="mdi mdi-timer-sand"></i> Pending
                    </span>
                )}
            </td>
            <td>{formattedDate}</td>
        </tr>
    );
};

export default OrderRow;
