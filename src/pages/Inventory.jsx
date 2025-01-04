import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InventoryRow from "../components/InventoryRow";
import axios from "axios";
import Navbar from "../components/NavBar";
import "../styles/Inventory.css";
import { updateQuantity } from "../redux/inventory/slice";
import { loadProducts } from "../redux/products/slice.js";
import { loadMachines } from "../redux/machines/slice.js";
import TopProducts from "../components/TopProducts.jsx";

const Inventory = () => {
    const dispatch = useDispatch();
    const inventory = useSelector((global) => global.inventory.list);
    const products = useSelector((global) => global.products.list);
    const transactions = useSelector((global) => global.transactions.list);

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const selectedMachine = JSON.parse(localStorage.getItem("selectedMachine"));
    const selectedMachineId = selectedMachine?.id;
    const selectedMachineLocation = selectedMachine?.location;

    useEffect(() => {
        if (products.length === 0) {
            axios.get("http://127.0.0.1:8000/api/admin/products").then(({ data }) => {
                dispatch(loadProducts(data));
            });
        }

        if (inventory.length === 0) {
            axios.get("http://127.0.0.1:8000/api/admin/inventory").then(({ data }) => {
                const action = { type: "inventory/loadInventory", payload: data };
                dispatch(action);
            });
        }
    }, [products, inventory, dispatch]);

    // Filter inventory for the selected machine
    const currentMachineInventory = products.map((product) => {
        const inventoryItem = inventory.find(
            (item) => item.machine_id === selectedMachineId && item.product_id === product.id
        );
        return {
            ...product,
            quantity: inventoryItem ? inventoryItem.quantity : 0,
        };
    });

    // Filter inventory based on search query
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
            machine_id: selectedMachine.id,
            product_id: productId,
            increment,
        };
        dispatch(updateQuantity(payload));

        try {
            await axios.post("http://127.0.0.1:8000/api/admin/update_inventory", {
                machine_id: selectedMachine.id,
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
                    <h2>Machine:<span className="selected-machine">{selectedMachine ? ` ${selectedMachineLocation}` : "Loading..."}</span></h2>
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
                            machineId={selectedMachineId}
                            products={products}
                            transactions={transactions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
