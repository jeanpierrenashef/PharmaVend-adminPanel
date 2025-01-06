import React from "react";
import CustomerRow from "../components/customers/CustomerRow";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import "../styles/Customers.css"
import CustomerPieChart from "../components/charts/CustomerPieChart";
import CustomerBarChartWithLine from "../components/charts/CustomerBarChartWithLine";
import { deleteUser, loadUsers } from "../redux/users/slice.js";
import {loadTransactions} from "../redux/transactions/slice.js"
import axiosInstance from "../utils/axiosInstance.js";

const Customers = () => {

    const customers = useSelector((state) => state.users.list);
    const transactions = useSelector((state) => state.transactions.list);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [showConfirmation, setShowConfirmation] = useState(false); 
    const [customerToDelete, setCustomerToDelete] = useState(null);
    
    useEffect(() => {
        if (customers.length === 0) {
            axiosInstance.get("/admin/users").then(({ data }) => {
                dispatch(loadUsers(data));
            });
        }

        if (transactions.length === 0) {
            axiosInstance.get("/admin/transactions").then(({ data }) => {
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
        const response = await axiosInstance.delete(`/admin/users/${id}`);
        console.log("API Response:", response.data);
        dispatch(deleteUser(id));
        setShowConfirmation(false);
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

    const openConfirmation = (customer) => {
        setCustomerToDelete(customer);
        setShowConfirmation(true);
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
                                <CustomerRow key={customer.id} customer={customer} onDelete={() => openConfirmation(customer)}/>
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
                <div>
                    <div className="charts">
                        <div className="chart">
                            <h2>Engagement of customers</h2>
                            <CustomerPieChart customers={customers} transactions={transactions}/>
                        </div>    
                        <div className="chart">
                            <h2>Customer Growth</h2>
                            <CustomerBarChartWithLine customers={customers} />
                        </div>          
                    </div>
                </div>
                    
            </div>
            {showConfirmation && (
                <div className="confirmation-modal">
                    <div className="modal-content">
                        <p>
                            Are you sure you want to delete customer{" "}
                            <strong>{customerToDelete?.username}</strong>?
                        </p>
                        <div className="modal-actions">
                            <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                            <button onClick={() => handleDelete(customerToDelete.id)}>Proceed</button>
                        </div>
                    </div>
                </div>
            )}
                
        </div>
    );
}
export default Customers;