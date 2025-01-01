import { createSlice } from "@reduxjs/toolkit";

const inventorySlice = createSlice({
    name: "inventory",
    initialState: {
        list:[],
    },
    reducers:{
        loadInventory: (state, action) => {
            const inventory = action.payload;

            return{
                ...state,
                list: inventory
            }
        }
    }
})
export default inventorySlice;
export const {loadInventory} = inventorySlice.actions;