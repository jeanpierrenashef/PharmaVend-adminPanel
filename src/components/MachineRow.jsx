import React from "react";

const MachineRow = ({ machine }) => {
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
        </tr>
    );
};

export default MachineRow;
