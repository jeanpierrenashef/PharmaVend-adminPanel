import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../utils/axiosInstance.js";
import MachineRow from "../components/machines/MachineRow.jsx";
import Navbar from "../components/NavBar.jsx";
import "../styles/Machines.css";
import AddMachineForm from "../components/machines/AddMachineForm.jsx";
import Modal from "react-modal";
import { deleteMachine} from "../redux/machines/slice.js";

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
            axiosInstance.get("/admin/machines").then(({ data }) => {
                const action = { type: "machines/loadMachines", payload: data };
                dispatch(action);
                setShouldFetchMachines(false); 
            });
        }
    }, [shouldFetchMachines, machines.length, dispatch]);

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
            await axiosInstance.delete(`/admin/machines/${id}`);
            dispatch(deleteMachine(id));
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
                    <div className="title-content">
                        <h1>All Machines</h1>
                        <div className="button-container">
                        <button className="open-modal-button" onClick={() => setIsModalOpen(true)}>
                            Add New Machine
                        </button>
                    </div>
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
