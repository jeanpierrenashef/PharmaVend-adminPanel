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
        },
        updateQuantity: (state, action) => {
            const { machine_id, product_id, increment } = action.payload;
            const item = state.list.find(
                (i) => i.machine_id === machine_id && i.product_id === product_id
            );
            if (item) {
                item.quantity = Math.max(0, item.quantity + increment);
            } else if (increment > 0) {
                state.list.push({
                    machine_id,
                    product_id,
                    quantity: increment,
                });
            }
        },
    }
})
export default inventorySlice;
export const {loadInventory, updateQuantity} = inventorySlice.actions;