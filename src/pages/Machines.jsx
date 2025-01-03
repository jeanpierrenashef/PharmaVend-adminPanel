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
import { delteMachine, updateMachine } from "../redux/machines/slice.js";

const Machines = () => {
    const dispatch = useDispatch();
    const machines = useSelector((global) => global.machines.list);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldFetchMachines, setShouldFetchMachines] = useState(false);
    const [editData, setEditData] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [showConfirmation, setShowConfirmation] = useState(false); 
    const [machineToDelete, setMachineToDelete] = useState(null);

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

    const totalPages = Math.ceil(machines.length / itemsPerPage); 
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInventory = machines.slice(startIndex, startIndex + itemsPerPage);
    
    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleDelete = async (id) => {
        try{
            await axios.delete(`http://127.0.0.1:8000/api/admin/machines/${id}`);
            dispatch(delteMachine(id));
            setShowConfirmation(false);
        }catch (e) {
            console.log("Error ", e);
        }
    }
    const handleEdit = (machine) => {
        setEditData(machine); 
        setIsModalOpen(true); 
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditData(null); 
    };
    const openConfirmation = (machine) => {
        setMachineToDelete(machine);
        setShowConfirmation(true);
    };

    return (
        <div className="machines-page">
            <Navbar />
            <div className="content">
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedInventory.map((machine) => (
                                <MachineRow key={machine.id} machine={machine} onDelete={() => openConfirmation(machine)} onEdit={handleEdit}/>
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
                            <h2>Machine Map</h2>
                            <MapComponent machines={machines} />
                        </div>
                        <div className="chart">
                            <h2>Machines Stats</h2>
                            <MachineStatusDonutChart machineStatusData={machineStatusData} />
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    className="modal-content"
                    overlayClassName="modal-overlay"
                    ariaHideApp={false}
                >
                    <button className="close-modal-button" onClick={handleCloseModal}>
                        ×
                    </button>
                    <AddMachineForm
                        setShouldFetchMachines={setShouldFetchMachines}
                        initialData={editData}
                    />
                </Modal>
            </div>
            {showConfirmation && (
            <div className="confirmation-modal">
                <div className="modal-content">
                    <p>
                        Are you sure you want to delete machine{" "}
                        <strong>V{machineToDelete?.id}</strong>?
                    </p>
                    <div className="modal-actions">
                        <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                        <button onClick={() => handleDelete(machineToDelete.id)}>Proceed</button>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default Machines;
