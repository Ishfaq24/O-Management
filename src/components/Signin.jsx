import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { email, password } = formData;
    // eslint-disable-next-line no-unused-vars
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Login successful! Redirecting...");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <form
        onSubmit={handleSignin}
        className="bg-white shadow-2xl rounded-2xl p-10 w-96 transition-transform transform hover:scale-105"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome Back
        </h2>

        {message && (
          <div
            className={`mb-4 text-center px-3 py-2 rounded-lg ${
              message.includes("successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            required
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition 
          bg-gradient-to-r from-green-500 to-green-600 
       hover:from-green-600 hover:to-green-700
      ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-sm text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-green-500 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signin;
