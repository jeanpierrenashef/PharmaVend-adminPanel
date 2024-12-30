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
        addMachine: (state, action) => {
            state.list.push(action.payload); 
        },
    }
})

export default machineSlice;
export const {loadMachines, addMachine} = machineSlice.actions;