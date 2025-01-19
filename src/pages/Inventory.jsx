import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InventoryRow from "../components/inventory/InventoryRow.jsx";
import axiosInstance from "../utils/axiosInstance.js";
import Navbar from "../components/NavBar";
import "../styles/Inventory.css";
import { updateQuantity } from "../redux/inventory/slice";
import { loadProducts } from "../redux/products/slice.js";
import TopProducts from "../components/charts/TopProducts.jsx";

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
            axiosInstance.get("/admin/products").then(({ data }) => {
                dispatch(loadProducts(data));
            });
        }

        if (inventory.length === 0) {
            axiosInstance.get("/admin/inventory").then(({ data }) => {
                const action = { type: "inventory/loadInventory", payload: data };
                dispatch(action);
            });
        }
    }, [products, inventory, dispatch]);

    const currentMachineInventory = products.map((product) => {
        const inventoryItem = inventory.find(
            (item) => item.machine_id === selectedMachineId && item.product_id === product.id
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
            machine_id: selectedMachine.id,
            product_id: productId,
            increment,
        };
        dispatch(updateQuantity(payload));

        try {
            await axiosInstance.post("/admin/update_inventory", {
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
                    <div className="title-content">
                        <h1>Inventory Management</h1>
                        <h2>Machine:<span className="selected-machine">{selectedMachine ? ` ${selectedMachineLocation}` : "Loading..."}</span></h2>
                    </div>
                    <div className="search-bar">
                        <i className="mdi mdi-magnify search-icon"></i>
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
