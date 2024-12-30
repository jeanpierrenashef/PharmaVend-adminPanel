import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const Machines = () => {
    const dispatch = useDispatch();
    const machines = useSelector((global)=>global.machines.list);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/admin/machines").then(({ data }) => {
            const action = { type: "machines/loadmachines", payload: data };
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
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        <MachineRow />
                    </tbody>
                </table>

                
            </div>

        </div>
    )
}