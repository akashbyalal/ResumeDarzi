import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import "./auth.style.css";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const {loading, handleRegister} = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleRegister({ username, email, password });
    if (success) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <main>
        <h1>Loading.....</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="form-container">
        <h1 className="text-4xl font-bold">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your Username"
              
              onChange={(e) => (setUsername(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your Email"
              
              onChange={(e) => (setEmail(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your Password"
              
              onChange={(e) => (setPassword(e.target.value))}
            />
          </div>

          <button type="submit" className="btn">
            Register
          </button>
        </form>
        <p className="">
          Already Have an account? <Link to="/login">Click here!</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;