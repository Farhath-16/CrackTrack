import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth }from "../context/AuthContext";
import api from "../api/axios";
import "./Login.css";
import {    requestNotificationPermission}from "../utils/notifications";

export default function Login() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            login(
                response.data.token,
                 response.data.email
            );
            await requestNotificationPermission();
          navigate("/dashboard");
        }

        catch (error) {

            setError(

                error.response?.data?.message ||

                "Login failed"

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-page">

            <div className="login-card">

                <h1>Placement Prep Manager</h1>

                <p>
                    Sign in to continue your preparation
                </p>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                {
                    error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )
                }

                <button
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {
                        loading
                            ? "Logging in..."
                            : "Login"
                    }
                </button>

                <p className="register-link">

                    Don't have an account?

                    <Link to="/register">
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );

}

