import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadProducts, deleteProduct } from "../redux/products/slice";
import Navbar from "../components/NavBar";
import axios from "axios";
import ProductContainer from "../components/ProductContainer";
import "../styles/Products.css"
import Modal from "react-modal";
import AddProductForm from "../components/AddProductForm";

const Products = () => {
    const dispatch = useDispatch();
    const products = useSelector((global) => global.products.list);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldFetchProducts, setShouldFetchProducts] = useState(false);
    const [editData, setEditData] = useState(null);

    const [showConfirmation, setShowConfirmation] = useState(false); 
    const [productToDelete, setProductToDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(()=>{
        if(shouldFetchProducts || products.length === 0){
            axios.get("http://127.0.0.1:8000/api/admin/products").then(({ data }) => {
                const action = { type: "products/loadProducts", payload: data };
                dispatch(action);
                setShouldFetchProducts(false); 
            });
        }
    }, [shouldFetchProducts, products.length, dispatch]);

    const handleDelete = async (id) => {
        try{
            await axios.delete(`http://127.0.0.1:8000/api/admin/products/${id}`);
            dispatch(deleteProduct(id));
            setShowConfirmation(false);
        }catch (e) {
            console.log("Error ", e);
        }
    }

    const handleEdit = (product) => {
        setEditData(product); 
        setIsModalOpen(true); 
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditData(null); 
    };

    const openConfirmation = (product) => {
        setProductToDelete(product);
        setShowConfirmation(true);
    };

    const totalPages = Math.ceil(products.length / itemsPerPage); 
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInventory = products.slice(startIndex, startIndex + itemsPerPage);
    
    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div className="products-page">
            <Navbar />
            <div className="products-container">
                <h1>Products</h1>
                <div className="button-container">
                    <button className="open-modal-button" onClick={() => setIsModalOpen(true)}>
                        Add Product
                    </button>
                </div>
                <div className="product-container">
                    {paginatedInventory.map((product) => (
                        <ProductContainer key={product.id} product={product} onEdit={handleEdit} onDelete={() => openConfirmation(product)}/>
                    ))}
                </div>
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
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    className="modal-content"
                    overlayClassName="modal-overlay"
                    ariaHideApp={false}
                >
                    <button className="close-modal-button" onClick={handleCloseModal}>
                        ×
                    </button>
                    <AddProductForm
                        setShouldFetchProducts={setShouldFetchProducts}
                        initialData={editData}
                    />
                </Modal>
            </div>
            {showConfirmation && (
            <div className="confirmation-modal">
                <div className="modal-content">
                    <p>
                        Are you sure you want to delete product{" "}
                        <strong>{productToDelete.name}</strong>?
                    </p>
                    <div className="modal-actions">
                        <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                        <button onClick={() => handleDelete(productToDelete.id)}>Proceed</button>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
export default Products