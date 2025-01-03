import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadProducts } from "../redux/products/slice";

const Products = () => {
    const dispatch = useDispatch();
    const products = useSelector((global) => global.products.list);

    useEffect(()=>{
        if(products.length === 0){
            axios.get("http://127.0.0.1:8000/api/admin/products").then(({ data }) => {
                dispatch(loadProducts(data));
            });
        }
    }, [products, dispatch])
}