import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./users/slice";
import transactionSlice from "./transactions/slice";

const store = configureStore({
    reducer:{
        usres: userSlice.reducer,
        transactions: transactionSlice.reducer,
    }
});
export default store;