import React from "react";
import MachineSelector from "../components/MachineSelector";
import Navbar from "../components/NavBar";
import "../styles/Dashboard.css";

const Dashboard = () => {
    const handleMachineSelection = (machine) => {
        console.log("Selected Machine:", machine);
    };

    return (
        <div className="dashboard-page">
            <Navbar />
            <div className="dashboard-content">
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
        </div>
    );
};

export default Dashboard;
