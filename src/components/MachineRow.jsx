import React from "react";

const MachineRow = ({ machine, onDelete  }) => {
    return (
        <tr>
            <td>{machine.id}</td>
            <td>{machine.location}</td>
            <td>{machine.latitude}</td>
            <td>{machine.longitude}</td>
            <td>
                {machine.status === "active" ? (
                    <span className="status active">
                        <i className="mdi mdi-check-circle"></i> Active
                    </span>
                ) : (
                    <span className="status inactive">
                        <i className="mdi mdi-close-circle"></i> Inactive
                    </span>
                )}
            </td>
            <td>
                <button
                    className="action-button delete-button"
                    onClick={() => onDelete(machine.id)}
                    title="Delete Machine"
                >
                    <i className="mdi mdi-trash-can-outline"></i>
                </button>
                <button className="action-button edit-button" title="Edit Machine">
                    <i className="mdi mdi-pencil-outline"></i>
                </button>
            </td>
        </tr>
    );
};

export default MachineRow;
