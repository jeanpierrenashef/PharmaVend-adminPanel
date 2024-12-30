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
                <span className="status active">Active</span>
            ) : (
                <span className="status inactive">Inactive</span>
            )}
            </td>
            <td>{new Date(machine.created_at).toISOString().split("T")[0]}</td>
        </tr>
    );
};
export default MachineRow;