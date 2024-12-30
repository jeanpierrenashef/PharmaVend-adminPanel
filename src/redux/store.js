import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./users/slice";
import transactionSlice from "./transactions/slice";
import productsSlice from "./products/slice";


const store = configureStore({
    reducer:{
        users: userSlice.reducer,
        transactions: transactionSlice.reducer,
        products: productsSlice.reducer,
    }
});
export default store;