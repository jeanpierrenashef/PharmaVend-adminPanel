import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: "products",
    initialState: {
        list:[],
    },
    reducers:{
        loadProducts: (state, action) => {
            const products = action.payload;

            return{
                ...state,
                list: products
            };
        },
        addProduct: (state, action) => {
            state.list.push(action.payload);
        },
        updateProduct: (state, action) => {
            state.list = state.list.map((product) => 
            product.id === action.payload.id ? action.payload : product)
        },
        deleteProduct: (state, action) => {
            const productId = action.payload;
            state.list = state.list.filter(product => product.id != productId);
        }
    }
});

export default productsSlice;
export const {loadProducts, addProduct, updateProduct, deleteProduct} = productsSlice.actions;