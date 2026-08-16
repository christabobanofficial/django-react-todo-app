import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();


    const handleRegister = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            await axios.post(
                "http://127.0.0.1:8000/api/tasks/register/",
                {
                    username: username,
                    password: password
                }
            );

            setMessage(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (error) {

            console.error(error);

            if (error.response?.data) {

                setError(
                    JSON.stringify(error.response.data)
                );

            } else {

                setError(
                    "Registration failed."
                );
            }
        }
    };


    return (

        <div className="auth-page">

            <div className="auth-card">

                <h1>Create Account 📝</h1>

                <p>
                    Start organizing your tasks today.
                </p>


                <form onSubmit={handleRegister}>

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
                        Register
                    </button>

                </form>


                {message && (
                    <p className="auth-success">
                        {message}
                    </p>
                )}


                {error && (
                    <p className="auth-error">
                        {error}
                    </p>
                )}


                <p>
                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;