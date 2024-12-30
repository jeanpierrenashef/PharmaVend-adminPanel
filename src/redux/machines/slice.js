import { createSlice } from "@reduxjs/toolkit";

const machineSlice = createSlice({
    name: "machines",
    initialState: {
        list: [],
    },
    reducers: {
        loadMachines: (state, action) => {
            const machines = action.payload;

            return{
                ...state,
                list: machines
            };
        },
    }
})

export default machineSlice;
export const {loadMachines} = machineSlice.actions;