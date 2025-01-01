import { createSlice } from "@reduxjs/toolkit";

const inventorySlice = createSlice({
    name: "inventories",
    initialState: {
        list:[],
    },
    reducers:{
        loadInventories: (state, action) => {
            const inventories = action.payload;

            return{
                ...state,
                list: inventories
            }
        }
    }
})