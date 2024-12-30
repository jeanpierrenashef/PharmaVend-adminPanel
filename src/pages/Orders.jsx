import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import TransactionRow from "../components/TransactionRow.jsx";
import "../styles/Orders.css";
import Navbar from "../components/NavBar.jsx";

const Transactions = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((global) => global.transactions.list);
    const users = useSelector((global) => global.users.list);
    const products = useSelector((global) => global.products.list);

    const [statusFilter, setStatusFilter] = useState("");
    const [quantityFilter, setQuantityFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/admin/transactions").then(({ data }) => {
            const action = { type: "transactions/loadTransactions", payload: data };
            dispatch(action);
        });
    }, []);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/admin/users").then(({ data }) => {
            const action = { type: "users/loadUsers", payload: data };
            dispatch(action);
        });
    }, []);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/admin/products").then(({ data }) => {
            const action = { type: "products/loadProducts", payload: data };
            dispatch(action);
        });
    }, []);


    const filteredTransactions = transactions.filter((transaction) => {
        if (statusFilter !== "" && String(transaction.dispensed) !== statusFilter) {
            return false;
        }
        if (quantityFilter !== "" && transaction.quantity < parseInt(quantityFilter)) {
            return false;
        }
        if (priceFilter !== "" && transaction.total_price < parseFloat(priceFilter)) {
            return false;
        }
        return true;
    });

    return (
        <div className="orders-page">
            <Navbar />
            <div className="main-content">
                <h1>Orders</h1>
                <div className="filters">
                    <div className="filter-dropdown filter-dropdown-after">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Status</option>
                            <option value="1">Dispensed</option>
                            <option value="0">Not Dispensed</option>
                        </select>
                    </div>
                    <div className="filter-dropdown">
                        <input
                            type="number"
                            placeholder="Min Quantity"
                            value={quantityFilter}
                            onChange={(e) => setQuantityFilter(e.target.value)}
                        />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Machine ID</th>
                            <th>Product</th>
                            <th>Status</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction, index) => {
                            const user = users.find((u) => u.id === transaction.user_id);
                            const product = products.find((p) => p.id === transaction.product_id);
                            return (
                                <TransactionRow
                                    key={transaction.id}
                                    transaction={transaction}
                                    user={user}
                                    product={product}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
