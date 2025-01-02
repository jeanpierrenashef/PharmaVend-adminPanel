import React from "react";

const MachineRow = ({ machine, onDelete , onEdit }) => {
    const handleToggleStatus = async () => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/admin/machines/toggle_status/${machine.id}`
            );
            dispatch(updateMachine(response.data));
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };
    return (
        <tr>
            <td>{machine.id}</td>
            <td>{machine.location}</td>
            <td>{machine.latitude}</td>
            <td>{machine.longitude}</td>
            <td onClick={handleToggleStatus} style={{ cursor: "pointer" }}>
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
                <button className="action-button edit-button"
                    onClick={() => onEdit(machine)}
                    title="Edit Machine"
                >
                    <i className="mdi mdi-pencil-outline"></i>
                </button>
            </td>
        </tr>
    );
};

export default MachineRow;
