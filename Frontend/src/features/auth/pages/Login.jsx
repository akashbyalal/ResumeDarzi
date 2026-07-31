import React, {useState} from "react";
import { useAuth } from "../hooks/useAuth";
import "./auth.style.css";
import { useNavigate } from "react-router-dom"


const Login = () => {

  const {loading, handleLogin} = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await handleLogin({username, password})
    if (success) {
      navigate("/")
    }
  }

  if(loading){
    return (<main><h1>Loading.....</h1></main>)
  }
  

  return (
    <main>
      <div className="form-container">
        <h1 className="text-4xl font-bold">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input id="username" onChange={(e) => {setUsername(e.target.value)}} type="text" placeholder="Enter your Username" />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input onChange={(e) => {setPassword(e.target.value)}} type="password" placeholder="Enter your Password" />
          </div>
          <p className="mb-0">
            here's{" "}
            <a
              href="https://share.google/PrHaNc00i5pidLYuf"
              target="_blank"
            >
              the Thing
            </a>{" "}
            if u forgot your Password
          </p>

          <button className="btn">Login</button>
        </form>
        <p className="">
          Don't have an Account? <a href="/register">Click here!</a>
        </p>
      </div>
    </main>
  );
};

export default Login;
