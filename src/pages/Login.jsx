import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loginForm, setLoginForm] = useState({
        username: "",
        password: "",
    });

    const handleLogin = () => {
        setError(""); 
        const data = new FormData();
        data.append("username", loginForm.username);
        data.append("password", loginForm.password);

        axios("http://127.0.0.1:8000/api/login", {
            method: "POST",
            data: data,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                const { user_type_id, token } = response.data;

                localStorage.setItem("token", token);
                if (user_type_id === 2) {
                    console.log("Admin logged in");
                    navigate("/dashboard");
                } else {
                    setError("Unauthorized access. Admins only.");
                }
            })
            .catch((error) => {
                if (error.response) {
                    const status = error.response.status;
                    if (status === 401) {
                        setError("Invalid credentials. Please try again.");
                    } else {
                        setError("An error occurred. Please try again.");
                    }
                } else {
                    setError("Failed to connect to the server.");
                }
            });
    };

    return (
        <div className="back">
            <div className="auth-container">
                <form
                    className="auth-form"
                    onSubmit={(e) => {
                        e.preventDefault(); 
                        handleLogin();
                    }}
                >
                    <h1>Admin Login</h1>
                    <input
                        type="text"
                        placeholder="Username"
                        value={loginForm.username}
                        onChange={(e) =>
                            setLoginForm({
                                ...loginForm,
                                username: e.target.value,
                            })
                        }
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) =>
                            setLoginForm({
                                ...loginForm,
                                password: e.target.value,
                            })
                        }
                    />
                    <button type="submit">Login</button>
                    {error && (
                        <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
                    )}
                </form>
            </div>
        </div>
        
    );
};

export default Login;
