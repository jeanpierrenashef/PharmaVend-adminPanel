import React from "react";
import {loadInventory} from "../redux/inventory/slice.js"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Inventory = () => {
    const dispatch = useDispatch();
    
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/api/admin/inventory").then(({data}) => {
            const action = { type: "inventory/loadInventory", payload: data};
            dispatch(action);
        })
    }, []);

    return(
        <div>
            
        </div>

    );

}
export default Inventory;