import React from "react";
import MachineSelector from "../components/machines/MachineSelector";
import Navbar from "../components/NavBar";
import "../styles/Dashboard.css";
import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import DonutChart from "../components/charts/DonutChart";
import TopProducts from "../components/charts/TopProducts";
import MachineStatusDonutChart from "../components/charts/MachineStatusDonutChart";
import MapComponent from "../components/charts/MapComponent";
import InventoryBarChart from "../components/charts/InventoryBarChart";
import TransactionBarChartWithLine from "../components/charts/TransactionBarChartWithLine";

const Dashboard = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((global) => global.transactions.list);
    const products = useSelector((global) => global.products.list)
    const machines = useSelector((global) => global.machines.list)
    const users = useSelector((global) => global.users.list);
    const inventory = useSelector((global) => global.inventory.list);


    const handleMachineSelection = (machine) => {
        console.log("Selected Machine:", machine);
    };

    useEffect(() => {
        axiosInstance.get("/admin/transactions").then(({ data }) => {
            const action = { type: "transactions/loadTransactions", payload: data };
            dispatch(action);
        });
        axiosInstance.get("/admin/products").then(({ data }) => {
            const action = { type: "products/loadProducts", payload: data };
            dispatch(action);
        });
        axiosInstance.get("/admin/inventory").then(({ data }) => {
            const action = { type: "inventory/loadInventory", payload: data };
            dispatch(action);
        });
        axiosInstance.get("/admin/machines").then(({ data }) => {
            const action = { type: "machines/loadMachines", payload: data };
            dispatch(action);
        });
        axiosInstance.get("/admin/users").then(({ data }) => {
            const action = { type: "users/loadUsers", payload: data };
            dispatch(action);
        });
    }, []);

    const orderStatusData = transactions.reduce(
        (acc, transaction) => {
            const key = transaction.dispensed === 1 ? "Dispensed" : "Not Dispensed"; 
            acc[key] += 1; 
            return acc;
        },
        { Dispensed: 0, "Not Dispensed": 0 } 
    );

    const machineStatusData = machines.reduce(
        (acc, machine) => {
            const key = machine.status === "active" ? "Active" : "Inactive";
            acc[key] += 1;
            return acc;
        },
        { Active: 0, Inactive: 0 }
    );
    
    

    return (
        <div className="dashboard-page">
            <Navbar />
            <div className="dashboard-content">
                <div className="top-section-content">
                    <div className="welcome-section">
                        <h1>Welcome Admin!</h1>
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
                    <div className="sectioning">
                        <div className="receipt-goods-chart">
                            <h2>Receipt of Goods</h2>
                            <DonutChart transactions={transactions} />
                        </div>

                        <div className="chart">
                            <h2>Total Transactions in Time</h2>
                            <TransactionBarChartWithLine transactions={transactions}/>
                        </div>
                        
                    </div>
                    <div className="sectioning">
                        <div className="chart">
                            <h2>Machine Map</h2>
                            <MapComponent machines={machines} />
                        </div>
                        <div className="chart">
                            <h2>Machines Stats</h2>
                            <MachineStatusDonutChart machineStatusData={machineStatusData} />
                        </div>
                    </div>
                    <div className="sectioning">
                        <div className="top-products-section-dash">
                            <h2>Top 5 Most Sold Products of All Time</h2>
                            <TopProducts
                                products={products}
                                transactions={transactions}
                            />
                        </div>

                        <div className="chart">
                            <h2>Total Sales Per Machine</h2>
                            <InventoryBarChart machines={machines} transactions={transactions} products={products}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
