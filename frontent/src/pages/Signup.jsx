import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Signup() {
    const [formData, setFormData] = useState({
        name: "",
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
                "/auth/signup",
                formData
            );

            setMessage(response.data.message);

            setTimeout(() =>{
              navigate("/login");
            },1000);

        } catch (error) {
            setMessage(
                error.response?.data?.message || "Signup failed"
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">

            <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800">

                <h1 className="text-3xl font-bold text-white text-center">
                    Create Account
                </h1>

                <p className="text-gray-400 text-center mt-2">
                    Join Task Manager today
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
                    />

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
                        Sign Up
                    </button>

                </form>

                {message && (
                    <p className="text-center text-green-400 mt-5">
                        {message}
                    </p>
                )}
            
             <p className="text-gray-300 text-center mt-6">Already have an account?{" "}
                 <a href="/login" className="text-blue-500">Login</a>
                </p>
            </div>
        </div>
    );
}

export default Signup;