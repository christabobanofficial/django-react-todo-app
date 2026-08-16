import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();
        setError("");

        try {

            const response = await axios.post(
                "http://127.0.0.1:8000/api/token/",
                {
                    username: username,
                    password: password
                }
            );

            // Save JWT tokens
            localStorage.setItem(
                "access_token",
                response.data.access
            );

            localStorage.setItem(
                "refresh_token",
                response.data.refresh
            );

            // Save username
            localStorage.setItem(
                "username",
                username
            );

            // Go to dashboard
            navigate("/");

        } catch (error) {

            console.error(error);

            setError(
                "Invalid username or password."
            );
        }
    };


    return (

        <div className="auth-page">

            <div className="auth-card">

                <h1>Welcome Back 👋</h1>

                <p>
                    Login to manage your tasks.
                </p>


                <form onSubmit={handleLogin}>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        required
                    />


                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />


                    <button type="submit">
                        Login
                    </button>

                </form>


                {error && (
                    <p className="auth-error">
                        {error}
                    </p>
                )}


                <p>
                    Don't have an account?{" "}

                    <Link to="/register">
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;