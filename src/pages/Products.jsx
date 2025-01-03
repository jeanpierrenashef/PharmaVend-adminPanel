import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadProducts } from "../redux/products/slice";
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

    useEffect(()=>{
        if(shouldFetchProducts || products.length === 0){
            axios.get("http://127.0.0.1:8000/api/admin/products").then(({ data }) => {
                const action = { type: "machines/loadProducts", payload: data };
                dispatch(action);
                setShouldFetchProducts(false); 
            });
        }
    }, [products, dispatch]);

    const handleEdit = (product) => {
        setEditData(product); 
        setIsModalOpen(true); 
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditData(null); 
    }

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
                    {products.map((product) => (
                        <ProductContainer key={product.id} product={product} onEdit={handleEdit}/>
                    ))}
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
        </div>
    );
}
export default Products