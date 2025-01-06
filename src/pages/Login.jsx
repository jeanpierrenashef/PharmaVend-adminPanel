import axios from "axios";
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"

const Login=() => {
    const Navigate = useNavigate();
    const [error, setError] = useState("")
    const [loginForm, setLoginForm] = useState({
        username :"",
        password:""
    });
    useEffect(()=>{
    },[loginForm])


    return(
        <div className="auth-container">
            <form className="auth-form">
                <h1>Admin Login</h1>
                <input type="text" placeholder="Username" onChange={(e)=>{
                    setLoginForm({
                        ...loginForm,
                        username: e.target.value,
                    });
                }}/>    
                <input type="password" placeholder="Password" onChange={(e)=>{
                    setLoginForm({
                        ...loginForm,
                        password:e.target.value,
                    });
                }}/>
                <button type="button" onClick={()=>{
                    
                    setError("");
                    const data = new FormData();
                    data.append("username", loginForm.username)
                    data.append("password", loginForm.password)

                    axios("http://127.0.0.1:8000/api/login",{
                        method:"POST",
                        data:data
                    },{
                        headers:{
                            "Content-Type" : "application/json",
                        },
                    }).then((response)=>{
                        console.log(response.data.user)
                        localStorage.setItem("token", response.data.token)
                        setLoginForm({
                            username :"",
                            password:""
                        });
                        Navigate("/dashboard");


                    }).catch((error)=>{
                        console.log("error")
                        
                    });
                }}>Login</button>
                
                {error && <p>{error}</p>}
            </form>
        </div>
    )
};
export default Login;