import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import OrderRow from "../components/orders/OrderRow.jsx";
import "../styles/Orders.css";
import Navbar from "../components/NavBar.jsx";
import DonutChart from "../components/charts/DonutChart.jsx";
import OrderStatusPieChart from "../components/charts/OrderStatusPieChart.jsx";

const Orders = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((global) => global.transactions.list);
    const users = useSelector((global) => global.users.list);
    const products = useSelector((global) => global.products.list);

    const [statusFilter, setStatusFilter] = useState("");
    const [quantityFilter, setQuantityFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const selectedMachine = JSON.parse(localStorage.getItem("selectedMachine"));
    const selectedMachineId = selectedMachine?.id;
    const selectedMachineLocation = selectedMachine?.location
    

    useEffect(() => {
        if(transactions.length === 0) {
            axios.get("http://127.0.0.1:8000/api/admin/transactions").then(({ data }) => {
                const action = { type: "transactions/loadTransactions", payload: data };
                dispatch(action);
            });
        }
        if(products.length === 0){
            axios.get("http://127.0.0.1:8000/api/admin/products").then(({ data }) => {
                const action = { type: "products/loadProducts", payload: data };
                dispatch(action);
            });
        }
        if(users.length === 0){
            axios.get("http://127.0.0.1:8000/api/admin/users").then(({ data }) => {
                const action = { type: "users/loadUsers", payload: data };
                dispatch(action);
            });
        }
    }, [transactions, products, users, dispatch]);

    const machineTransactions = transactions.filter(
        (transaction) => transaction.machine_id === selectedMachineId
    );

    const filteredTransactions = machineTransactions.filter((transaction) => {
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

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);


    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    
    return (
        <div className="orders-page">
            <Navbar />
            <div className="content">
                <div className="main-content">
                    <h1>Orders</h1>
                    <h2>Machine: <span className="selected-machine">{selectedMachineLocation}</span></h2>
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
                        <div className="filter-dropdown">
                            <input
                                type="number"
                                step="0.50"
                                placeholder="Min Price"
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                            />
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Product</th>
                                <th>Status</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTransactions.map((transaction) => {
                                const user = users.find((u) => u.id === transaction.user_id);
                                const product = products.find((p) => p.id === transaction.product_id);
                                return (
                                    <OrderRow
                                        key={transaction.id}
                                        transaction={transaction}
                                        user={user}
                                        product={product}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="pagination-controls">
                        <button onClick={handlePrevPage} disabled={currentPage === 1}> 
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                    
                </div>
                <div className="charts">
                    <div className="chart">
                        <h2>Receipt of Goods</h2>
                        <DonutChart transactions={filteredTransactions} />
                    </div>
                    <div className="chart">
                        <h2>Order Status</h2>
                        <OrderStatusPieChart transactions={filteredTransactions}/>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Orders;
