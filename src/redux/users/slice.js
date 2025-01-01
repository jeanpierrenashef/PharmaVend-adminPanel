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
        deleteUsers: (state, action) => {
            const userId = action.payload;
            state.list = state.list.filter(user => user.id !== userId);

        }
    }
});

export default userSlice;
export const {loadUsers} = userSlice.actions;