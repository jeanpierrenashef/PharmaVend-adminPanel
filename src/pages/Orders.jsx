import react, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import OrderRow from "../components/OrderRow.jsx"

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
    }, []);


    return(
        <div className="transactions">
            <h1>Transactions</h1>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Machine ID</th>
                    <th>Product ID</th>
                    <th>Created At</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction) => {
                    const user = users.find((u) => u.id === transaction.user_id);
                    return (
                    <OrderRow
                        key={transaction.id}
                        transaction={transaction}
                        user={user}
                    />
                    );
                })}
                </tbody>
            </table>
    </div>
    );
}
export default Orders;