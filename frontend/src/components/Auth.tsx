import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { AppDispatch } from "../app/store";
import API from "../api/axios";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async () => {
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await API.post(endpoint, { email, password });

      if (isLogin) {
        dispatch(loginSuccess(res.data));
      } else {
        alert("Registered! Now log in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>{isLogin ? "Login" : "Register"}</button>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "No account? Register" : "Have account? Login"}
      </button>
    </div>
  );
};

export default Auth;
