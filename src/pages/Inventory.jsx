import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InventoryRow from "../components/InventoryRow";
import axios from "axios";
import Navbar from "../components/NavBar";
import "../styles/Inventory.css"
import { updateQuantity } from "../redux/inventory/slice";
import {loadProducts} from "../redux/products/slice.js";
import {loadMachines} from "../redux/machines/slice.js";
import TopProducts from "../components/TopProducts.jsx";
import InventoryBarChart from "../components/InventoryBarChart.jsx";

const Inventory = () => {
    const dispatch = useDispatch();
    const inventory = useSelector((global) => global.inventory.list);
    const machines = useSelector((global) => global.machines.list);
    const products = useSelector((global) => global.products.list);
    const transactions = useSelector((global) => global.transactions.list)

    const [currentMachineIndex, setCurrentMachineIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    useEffect(() => {
        if (products.length === 0) {
            axios.get("http://127.0.0.1:8000/api/admin/products").then(({ data }) => {
                dispatch(loadProducts(data));
            });
        }

        if (machines.length === 0) {
            axios.get("http://127.0.0.1:8000/api/admin/machines").then(({ data }) => {
                dispatch(loadMachines(data));
            });
        }
    }, [products, machines, dispatch]);

    
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/api/admin/inventory").then(({data}) => {
            const action = { type: "inventory/loadInventory", payload: data};
            dispatch(action);
        })
    }, []);

    const handlePrevMachine = () => {
        setCurrentMachineIndex((prev) => (prev > 0 ? prev - 1 : machines.length - 1));
        setCurrentPage(1);
        setSearchQuery("");
    };

    const handleNextMachine = () => {
        setCurrentMachineIndex((prev) => (prev < machines.length - 1 ? prev + 1 : 0));
        setCurrentPage(1);
        setSearchQuery("");
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

    const filteredInventory = currentMachineInventory.filter((item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const totalPages = Math.ceil(filteredInventory.length / itemsPerPage); 
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInventory = filteredInventory.slice(startIndex, startIndex + itemsPerPage);
    

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleUpdateQuantity = async (productId, increment) => {
        const payload = {
            machine_id: currentMachine.id,
            product_id: productId,
            increment,
        };
        dispatch(updateQuantity(payload));

        try {
            await axios.post("http://127.0.0.1:8000/api/admin/update_inventory", {
                machine_id: currentMachine.id,
                product_id: productId,
                add_quantity: increment,
            });
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div className="inventory-page">
            <Navbar />
            <div className="content">
                <div className="main-content">
                    <h1>Inventory Management</h1>

                    <div className="machine-navigation">
                        <button onClick={handlePrevMachine}>&lt;</button>
                        <h2>{currentMachine ? `Machine ID: ${currentMachine.id}` : "Loading..."}</h2>
                        <button onClick={handleNextMachine}>&gt;</button>
                    </div>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search for medicine..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
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
                            {paginatedInventory.map((item) => (
                                <InventoryRow
                                    key={item.product_id}
                                    product={item}
                                    quantity={item.quantity}
                                    onUpdateQuantity={handleUpdateQuantity}
                                />
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination-controls">
                        <button onClick={handlePrevPage} disabled={currentPage === 1}> 
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </div>
                <div className="data">
                    <div className="top-products-section">
                        <h2>Top 3 Most Sold Products</h2>
                        <TopProducts
                            machineId={currentMachine?.id}
                            products={products}
                            transactions={transactions}
                        />
                    </div>

                </div>
            </div>
            
        </div>
    );

}
export default Inventory;