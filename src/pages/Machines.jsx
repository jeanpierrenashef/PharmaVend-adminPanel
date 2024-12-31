import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import MachineRow from "../components/MachineRow.jsx";
import Navbar from "../components/NavBar.jsx";
import "../styles/Machines.css";
import MapComponent from "../components/MapComponent.jsx";
import MachineStatusDonutChart from "../components/MachineStatusDonutChart.jsx";
import AddMachineForm from "../components/AddMachineForm.jsx";
import Modal from "react-modal";
import { delteMachine } from "../redux/machines/slice.js";

const Machines = () => {
    const dispatch = useDispatch();
    const machines = useSelector((global) => global.machines.list);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldFetchMachines, setShouldFetchMachines] = useState(false);

    useEffect(() => {
        if (shouldFetchMachines || machines.length === 0) {
            axios.get("http://127.0.0.1:8000/api/admin/machines").then(({ data }) => {
                const action = { type: "machines/loadMachines", payload: data };
                dispatch(action);
                setShouldFetchMachines(false); 
            });
        }
    }, [shouldFetchMachines, machines.length, dispatch]);

    const machineStatusData = machines.reduce(
        (acc, machine) => {
            const key = machine.status === "active" ? "Active" : "Inactive";
            acc[key] += 1;
            return acc;
        },
        { Active: 0, Inactive: 0 }
    );

    const handleDelete = async (id) => {
        try{
            await axios.delete(`http://127.0.0.1:8000/api/admin/machines/${id}`);
            dispatch(delteMachine(id));
        }catch (e) {
            console.log("Error ", e);
        }
    }

    return (
        <div className="machines-page">
            <Navbar />
            <div className="main-content">
                <h1>Machines</h1>
                <div className="button-container">
                    <button className="open-modal-button" onClick={() => setIsModalOpen(true)}>
                        Add Machine
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Location</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {machines.map((machine) => (
                            <MachineRow key={machine.id} machine={machine} />
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="maps">
                <div>
                    <h2>Machine Map</h2>
                    <MapComponent machines={machines} />
                </div>
                <div>
                    <h2>Machines Stats</h2>
                    <MachineStatusDonutChart machineStatusData={machineStatusData} />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="modal-content"
                overlayClassName="modal-overlay"
                ariaHideApp={false}
            >
                <button className="close-modal-button" onClick={() => setIsModalOpen(false)}>
                    ×
                </button>
                <AddMachineForm setShouldFetchMachines={setShouldFetchMachines} />
            </Modal>
        </div>
    );
};

export default Machines;
