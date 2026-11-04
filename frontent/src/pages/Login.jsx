import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post(
                "/auth/login",
                formData
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            setMessage("Login successful!");

            setTimeout(() =>{
              navigate("/dashboard")
            },1000)

        } catch (error) {
            setMessage(
                error.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">

            <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800">

                <h1 className="text-3xl font-bold text-white text-center">
                    Welcome Back
                </h1>

                <p className="text-gray-400 text-center mt-2">
                    Login to your account
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
                    >
                        Login
                    </button>

                </form>

                {message && (
                    <p className="text-center text-green-400 mt-5">
                        {message}
                    </p>
                )}

                <p className="text-gray-300 text-center mt-6">Don't have an account?{""}
                 <a href="/signup" className="text-blue-500">Sign up</a>
                </p>

            </div>
        </div>
    );
}

export default Login;
