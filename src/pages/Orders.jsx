import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import TransactionRow from "../components/TransactionRow.jsx";

const Transactions = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((global) => global.transactions.list);
    const users = useSelector((global) => global.users.list);

    // Fetch Transactions
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/admin/transactions").then(({ data }) => {
            const action = { type: "transactions/loadTransactions", payload: data };
            dispatch(action);
        });
    }, [dispatch]);

    // Fetch Users
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/admin/users").then(({ data }) => {
            const action = { type: "users/loadUsers", payload: data };
            dispatch(action);
        });
    }, [dispatch]);

    return (
        <div className="transactions">
            <h1>Transactions</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Machine ID</th>
                        <th>Product ID</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => {
                        const user = users.find((u) => u.id === transaction.user_id);
                        return (
                            <TransactionRow
                                key={transaction.id || `transaction-${index}`}
                                transaction={transaction}
                                user={user}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;
