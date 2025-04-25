// src/pages/Login.jsx

import { useState } from "react";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const toggleForm = () => setIsRegister(!isRegister);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-10 max-w-md w-full h-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-400">
            {isRegister
              ? "Sign up to report complaints"
              : "Sign in to your account"}
          </p>
        </div>

        <form className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors py-2 rounded-lg font-semibold"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              onClick={toggleForm}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
