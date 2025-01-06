import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "../../styles/MachineSelector.css"

const MachineSelector = ({ onSelectMachine }) => {
    const [machines, setMachines] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState(() => {
        const savedMachine = localStorage.getItem("selectedMachine");
        return savedMachine ? JSON.parse(savedMachine) : null;
    });
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        axiosInstance.get("/admin/machines").then(({ data }) => {
            setMachines(data);
        });
    }, []);

    const handleSelectMachine = (machine) => {
        setSelectedMachine(machine);
        localStorage.setItem("selectedMachine", JSON.stringify(machine));
        setShowDropdown(false);
        if (onSelectMachine) onSelectMachine(machine);
    };

    return (
        <div className="machine-selector-wrapper">
            <div className="selected-machine-box">
                <div className="selected-machine-info">
                    <div className="selected-top-box">
                        <h3>
                            <i className="mdi mdi-cog-outline"></i> Selected Machine
                        </h3>
                        <button
                            className="dropdown-toggle"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                        {showDropdown ? (
                            <>
                                    <i className="mdi mdi-chevron-up"></i> Close
                                </>
                            ) : (
                                <>
                                    <i className="mdi mdi-chevron-down"></i> Select
                                </>
                            )}
                        </button>
                    </div>
                    <p><strong>Name:</strong> {selectedMachine?.location || "None"}</p>
                    <p><strong>ID:</strong> {selectedMachine?.id || "N/A"}</p>
                    <p>
                        <strong>Status:</strong>{" "}
                        {selectedMachine?.status === "active" ? (
                            <span className="status active">
                                <i className="mdi mdi-check-circle-outline"></i> Active
                            </span>
                        ) : (
                            <span className="status inactive">
                                <i className="mdi mdi-close-circle-outline"></i> Inactive
                            </span>
                        )}
                    </p>
                </div>
                
            </div>
            {showDropdown && (
                <div className="dropdown-menu">
                    {machines.map((machine) => (
                        <div
                            key={machine.id}
                            className={`dropdown-item ${
                                selectedMachine?.id === machine.id ? "selected" : ""
                            }`}
                            onClick={() => handleSelectMachine(machine)}
                        >
                            <p>
                                <strong>
                                    <i className="mdi mdi-map-marker"></i> {machine.location}
                                </strong>{" "}
                                (ID: {machine.id})
                            </p>
                            <p>
                                Status:{" "}
                                {machine.status === "active" ? (
                                    <span className="status active">
                                        <i className="mdi mdi-check-circle-outline"></i> Active
                                    </span>
                                ) : (
                                    <span className="status inactive">
                                        <i className="mdi mdi-close-circle-outline"></i> Inactive
                                    </span>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MachineSelector;
