import React from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { updateMachine } from "../../redux/machines/slice";

const MachineRow = ({ machine, onDelete , onEdit }) => {
    const dispatch = useDispatch();
    const handleToggleStatus = async () => {
        try {
            const response = await axiosInstance.post(
                `/admin/machines/toggle_status/${machine.id}`
            );
            dispatch(updateMachine(response.data));
        } catch (error) {
            console.error(error);
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
