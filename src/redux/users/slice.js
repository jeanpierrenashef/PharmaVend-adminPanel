import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "users",
    initialState: {
        list:[],
    },
    reducers:{
        loadUsers: (state, action) => {
            const users = action.payload;

            return {
                ...state,
                list:users,
            };
        },
    }
});

export default userSlice;
export const {loadUsers} = userSlice.actions;