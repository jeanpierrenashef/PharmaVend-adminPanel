import React from "react";
import {loadInventory} from "../redux/inventory/slice.js"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Inventory = () => {
    const dispatch = useDispatch();
    const inventory = useSelector((global) => global.inventory.list);
    const machines = useSelector((state) => state.machines.list);
    const products = useSelector((state) => state.products.list);

    const [currentMachineIndex, setCurrentMachineIndex] = useState(0);

    
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/api/admin/inventory").then(({data}) => {
            const action = { type: "inventory/loadInventory", payload: data};
            dispatch(action);
        })
    }, []);

    const handlePrevMachine = () => {
        setCurrentMachineIndex((prev) => (prev > 0 ? prev - 1 : machines.length - 1));
    };

    const handleNextMachine = () => {
        setCurrentMachineIndex((prev) => (prev < machines.length - 1 ? prev + 1 : 0));
    };

    const currentMachine = machines[currentMachineIndex];

    const currentMachineInventory = inventories.filter(
        (inventory) => inventory.machine_id === currentMachine?.id
    );

    return(
        <div>

        </div>

    );

}
export default Inventory;