import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import MachineRow from "../components/MachineRow.jsx"
import Navbar from "../components/NavBar.jsx";
import "../styles/Machines.css"

const Machines = () => {
    const dispatch = useDispatch();
    const machines = useSelector((global)=>global.machines.list);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/admin/machines").then(({ data }) => {
            const action = { type: "machines/loadMachines", payload: data };
            dispatch(action);
        });
    }, []);

    return(
        <div className="machines-page">
            <Navbar />
            <div className="main-content">
                <h1>Machines</h1>
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

        </div>
    )
}
export default Machines;