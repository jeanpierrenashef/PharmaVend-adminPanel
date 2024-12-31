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
        delteMachine: (state,action) => {
            const machineId = action.payload;
            state.list = state.list.filter(machine=>machine.id !== machineId);
        },
        updateMachine: (state, action) => {
            const machineId = action.payload;
            const index = state.list.findIndex((machine) => machine.id === machineId);
            if (index !== -1) {
                state.list[index] = action.payload; 
            }
        }
    }
})

export default machineSlice;
export const {loadMachines, addMachine, delteMachine, updateMachine} = machineSlice.actions;