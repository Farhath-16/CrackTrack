import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {useNavigate} from "react-router-dom";
import "./Register.css";

export default function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate=useNavigate();
  const handleRegister=async()=>{
      try{
            const res=await api.post("/auth/signup",{email,password});
            alert(res.data.message);
            navigate("/");
      }
      catch(error){
            alert("Error occurred while registering.",error.response?.data?.message || "Registration Error");
      }
  }

  return (
    <div className="register-page">

      <div className="register-card">

        <h1>Placement Prep Manager</h1>

        <p>
          Create your account
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleRegister}>
          Register
        </button>

        <p>
          Already have an account?
          <Link to="/">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}