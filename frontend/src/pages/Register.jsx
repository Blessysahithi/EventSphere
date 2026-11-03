import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post("/auth/register", formData);

            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 1500);

        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                <p>Join EventSphere today!</p>

                {["name", "email", "password"].map((field) => (
                    <input
                        key={field}
                        type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                        placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                        value={formData[field]}
                        onChange={(e) =>
                            setFormData({ ...formData, [field]: e.target.value })
                        }
                        required
                    />
                ))}

                <button type="submit">Register</button>

                {message && <p>{message}</p>}

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;