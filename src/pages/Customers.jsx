import React from "react";
import CustomerRow from "../components/CustomerRow";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/NavBar";
import "../styles/Customers.css"
import CustomerPieChart from "../components/CustomerPieChart";
import CustomerBarChartWithLine from "../components/CustomerBarChartWithLine";
import { deleteUser } from "../redux/users/slice.js";

import axios from "axios";

const Customers = () => {
    const customers = useSelector((state) => state.users.list);
    const transactions = useSelector((state) => state.transactions.list);
    const dispatch = useDispatch();

    const customersWithOrderCount = customers.map((customer) => {
        const totalOrders = transactions.filter(
            (transaction) => transaction.user_id === customer.id
        ).length;

        return { ...customer, totalOrders };
    });

    const handleDelete = async (id) => {
        try{
            await axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}`);
            dispatch(deleteUser(id));
        }catch (e) {
            console.log("Error ", e);
        }
    }

    return (
        <div className="customers-page">
            <Navbar />
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
                        {customersWithOrderCount.map((customer) => (
                            <CustomerRow key={customer.id} customer={customer} onDelete={handleDelete}/>
                        ))}
                    </tbody>
                </table>
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
    );
}
export default Customers;