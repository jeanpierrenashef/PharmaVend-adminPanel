import React from "react";
import MachineSelector from "../components/MachineSelector";
import Navbar from "../components/NavBar";
import "../styles/Dashboard.css";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import DonutChart from "../components/DonutChart";
import TopProducts from "../components/TopProducts";

const Dashboard = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((global) => global.transactions.list);
    const products = useSelector((global) => global.products.list)
    //const inventories = useSelector((global) => global.inventories.list)

    const handleMachineSelection = (machine) => {
        console.log("Selected Machine:", machine);
    };

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/admin/transactions").then(({ data }) => {
            const action = { type: "transactions/loadTransactions", payload: data };
            dispatch(action);
        });
    }, []);
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/admin/products").then(({ data }) => {
            const action = { type: "products/loadProducts", payload: data };
            dispatch(action);
        });
    }, []);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/admin/inventory").then(({ data }) => {
            const action = { type: "inventory/loadInventory", payload: data };
            dispatch(action);
        });
    }, []);

    return (
        <div className="dashboard-page">
            <Navbar />
            <div className="dashboard-content">
                <div className="top-section-content">
                    <div className="welcome-section">
                        <h1>Welcome, John Smith!</h1>
                        <p>
                            On the right, you can select the machine you want to see statistics for. Below, you'll find the 
                            total statistics for all machines and the entire system.
                        </p>
                    </div>
                    <div>
                        <MachineSelector onSelectMachine={handleMachineSelection} />
                    </div>
                </div>
                <div className="charts-section">
                    <div className="receipt-goods-chart">
                        <h2>Receipt of Goods</h2>
                        <DonutChart transactions={transactions} />
                    </div>
                    <div className="top-products-section-dash">
                        <h2>Top 3 Most Sold Products of All Time</h2>
                        <TopProducts
                            products={products}
                            transactions={transactions}
                        />
                    </div>
                        
                </div>
                    
            </div>
        </div>
    );
};

export default Dashboard;
