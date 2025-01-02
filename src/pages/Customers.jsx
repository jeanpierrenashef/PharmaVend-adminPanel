import React from "react";
import CustomerRow from "../components/CustomerRow";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import "../styles/Customers.css"
import CustomerPieChart from "../components/CustomerPieChart";
import CustomerBarChartWithLine from "../components/CustomerBarChartWithLine";
import { deleteUser, loadUsers } from "../redux/users/slice.js";
import {loadTransactions} from "../redux/transactions/slice.js"
import axios from "axios";

const Customers = () => {

    const customers = useSelector((state) => state.users.list);
    const transactions = useSelector((state) => state.transactions.list);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    useEffect(() => {
        if (customers.length === 0) {
            axios.get("http://127.0.0.1:8000/api/admin/users").then(({ data }) => {
                dispatch(loadUsers(data));
            });
        }

        if (transactions.length === 0) {
            axios.get("http://127.0.0.1:8000/api/admin/transactions").then(({ data }) => {
                dispatch(loadTransactions(data));
            });
        }
    }, [customers, transactions, dispatch]);

    const customersWithOrderCount = customers.map((customer) => {
        const totalOrders = transactions.filter(
            (transaction) => transaction.user_id === customer.id
        ).length;

        return { ...customer, totalOrders };
    });

    const handleDelete = async (id) => {
    try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}`);
        console.log("API Response:", response.data);
        dispatch(deleteUser(id));
    } catch (e) {
        console.error("Error deleting user:", e);
    }
    };
    const totalPages = Math.ceil(customersWithOrderCount.length / itemsPerPage); 
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInventory = customersWithOrderCount.slice(startIndex, startIndex + itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div className="customers-page">
            <Navbar />
            <div className="content">
                <div className="main-content">
                    <h1>Customers</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Total Orders</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedInventory.map((customer) => (
                                <CustomerRow key={customer.id} customer={customer} onDelete={handleDelete}/>
                            ))}
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
                        <h2>Engagement of customers</h2>
                        <CustomerPieChart customers={customers} transactions={transactions}/>
                    </div>    
                    <hr className="separator-line" />
                    <div className="chart">
                        <h2>Customer Growth</h2>
                        <CustomerBarChartWithLine customers={customers} />
                    </div>          
                </div>
            </div>
                
        </div>
    );
}
export default Customers;