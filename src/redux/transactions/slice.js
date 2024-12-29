import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = transactionSlice({
    name: "transactions",
    initialState: {
        list:[],
    },
    reducers:{
        loadTransactions: (state, action) => {
            const transactions = action.payload;

            return{
                ...state,
                list:transactions
            };
        },
    }
})