import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const Machines = () => {
    const dispatch = useDispatch();
    const machines = useSelector((global)=>global.machines.list);

    useEffect(()=>{
        axios.get("")
    })
}