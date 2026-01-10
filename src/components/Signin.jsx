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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Login successful! Redirecting...");
    setTimeout(() => navigate("/dashboard"), 1000);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 px-4">
      <form
        onSubmit={handleSignin}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 transition-all duration-300 hover:shadow-3xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 text-center px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
              message.includes("successful")
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
            transition"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
            transition"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-7 py-3 rounded-xl text-white font-semibold tracking-wide
          bg-gradient-to-r from-green-500 to-emerald-600
          hover:from-green-600 hover:to-emerald-700
          shadow-lg hover:shadow-xl
          transition-all duration-300
          ${loading ? "opacity-70 cursor-not-allowed" : "active:scale-95"}`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Footer */}
        <p className="text-sm text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-green-600 font-semibold cursor-pointer hover:underline"
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
