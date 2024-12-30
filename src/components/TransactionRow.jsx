import React from "react";

const TransactionRow = ({ transaction, user, product }) => {
    return (
        <tr>
        <td>#000{transaction.id}</td>
        <td>{user?.username || "Unknown"}</td>
        <td>{user?.email || "Unknown"}</td>
        <td>{transaction.quantity}</td>
        <td>${transaction.total_price}</td>
        <td>V{transaction.machine_id}</td>
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
        <td>{transaction.created_at}</td>
        </tr>
    );
};

export default TransactionRow;
