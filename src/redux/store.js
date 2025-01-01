import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./users/slice";
import transactionSlice from "./transactions/slice";
import productsSlice from "./products/slice";
import machineSlice from "./machines/slice";
import inventorySlice from "./inventories/slice";


const store = configureStore({
    reducer:{
        users: userSlice.reducer,
        transactions: transactionSlice.reducer,
        products: productsSlice.reducer,
        machines: machineSlice.reducer,
        inventories : inventorySlice.reducer
    }
});
export default store;