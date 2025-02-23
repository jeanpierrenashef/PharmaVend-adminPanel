import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
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
});

export default transactionSlice;
export const {loadTransactions} = transactionSlice.actions;