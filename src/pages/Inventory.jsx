import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InventoryRow from "../components/InventoryRow";
import axios from "axios";
import Navbar from "../components/NavBar";
import "../styles/Inventory.css"

const Inventory = () => {
    const dispatch = useDispatch();
    const inventory = useSelector((global) => global.inventory.list);
    const machines = useSelector((state) => state.machines.list);
    const products = useSelector((state) => state.products.list);

    const [currentMachineIndex, setCurrentMachineIndex] = useState(0);

    
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/api/admin/inventory").then(({data}) => {
            const action = { type: "inventory/loadInventory", payload: data};
            dispatch(action);
        })
    }, []);

    const handlePrevMachine = () => {
        setCurrentMachineIndex((prev) => (prev > 0 ? prev - 1 : machines.length - 1));
    };

    const handleNextMachine = () => {
        setCurrentMachineIndex((prev) => (prev < machines.length - 1 ? prev + 1 : 0));
    };

    const currentMachine = machines[currentMachineIndex];

    const currentMachineInventory = products.map((product) => {
        const inventoryItem = inventory.find(
            (item) => item.machine_id === currentMachine?.id && item.product_id === product.id
        );
        return {
            ...product,
            quantity: inventoryItem ? inventoryItem.quantity : 0,
        };
    });

    return (
        <div className="inventory-page">
            <Navbar />
            <div className="main-content">
                <h1>Inventory Management</h1>

                <div className="machine-navigation">
                    <button onClick={handlePrevMachine}>&lt;</button>
                    <h2>{currentMachine ? `Machine ID: ${currentMachine.id}` : "Loading..."}</h2>
                    <button onClick={handleNextMachine}>&gt;</button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMachineInventory.map((item) => (
                            <InventoryRow
                                key={item.product_id}
                                product={item}
                                quantity={item.quantity}
                            />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

}
export default Inventory;