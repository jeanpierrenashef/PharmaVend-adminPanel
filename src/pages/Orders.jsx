import react, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const Orders = () => {
    const navigate = useNavigate();
    const transactions = useSelector((global)=>global.transactions);
    const users = useSelector((global)=>gloval.transactions);
    const dispatch = useDispatch();

    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/api/admin/users"
        ).then(({data})=>{
            const action = {type: "users/loadUsers", payload: data}
            dispatch(action)
        });
    },[])

    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/api/admin/transactions"
        ).then(({data})=>{
            const action = {type: "transactions/loadTransactions", payload: data}
            dispatch(action)
        })
    }, [])


    return(
        <h1>hello</h1>
    );
}
export default Orders;