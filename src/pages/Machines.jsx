import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import MachineRow from "../components/MachineRow.jsx"
import Navbar from "../components/NavBar.jsx";
import "../styles/Machines.css"
import MapComponent from "../components/MapComponent.jsx";

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
            <div className="maps">
                <h2>Machine Map</h2>
                <MapComponent machines={machines} />
            </div>
            

        </div>
    )
}
export default Machines;