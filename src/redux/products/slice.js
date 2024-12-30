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
        }
    }
});

export default productsSlice;
export const {loadProducts} = productsSlice.actions;